import json
import os
import tempfile
import traceback

import pandas as pd
import pika

from app.core.config import settings

from app.services.minio_service import (
    download_dataset
)

from app.services.model_service import (
    save_model
)

from app.services.model_metadata_service import (
    create_model_record
)

from app.services.request_service import (
    update_request_status
)

from app.services.credit_service import (
    debit_credits
)

from app.services.training_service import (
    train_classification_model,
    train_regression_model,
    train_unsupervised_model
)


def process_message(
    ch,
    method,
    properties,
    body
):
    message = json.loads(body)

    request_id = message["request_id"]

    # NEW: Get user_id from the RabbitMQ message
    user_id = message["user_id"]

    try:
        update_request_status(
            request_id,
            "TRAINING"
        )

        with tempfile.TemporaryDirectory() as temp_dir:

            dataset_file = os.path.join(
                temp_dir,
                "dataset.csv"
            )

            model_file = os.path.join(
                temp_dir,
                f"{request_id}.joblib"
            )

            download_dataset(
                message["processed_dataset_path"],
                dataset_file
            )

            df = pd.read_csv(
                dataset_file
            )

            if (
                message["learning_type"]
                == "supervised"
            ):

                test_start_row = (
                    message["test_start_row"]
                )

                train_df = df.iloc[
                    :test_start_row
                ]

                test_df = df.iloc[
                    test_start_row:
                ]

                if (
                    message["problem_type"]
                    == "classification"
                ):

                    model_type = message[
                        "classification_model"
                    ]

                    model, metrics = (
                        train_classification_model(
                            train_df,
                            test_df,
                            message[
                                "target_column"
                            ],
                            model_type
                        )
                    )

                else:

                    model_type = message[
                        "regression_model"
                    ]

                    model, metrics = (
                        train_regression_model(
                            train_df,
                            test_df,
                            message[
                                "target_column"
                            ],
                            model_type
                        )
                    )

            else:

                model_type = message[
                    "unsupervised_model"
                ]

                model, metrics = (
                    train_unsupervised_model(
                        df,
                        model_type
                    )
                )

            model_path = save_model(
                model=model,
                request_id=request_id,
                local_model_path=model_file
            )

            create_model_record(
                user_id=user_id,
                request_id=request_id,
                model_type=model_type,
                model_path=model_path,
                metrics=metrics
            )

            debit_credits(
                user_id=user_id,
                request_id=request_id,
                model_type=model_type
            )

            update_request_status(
                request_id,
                "COMPLETED"
            )

            ch.basic_ack(
                delivery_tag=method.delivery_tag
            )

    except Exception as e:
        print(f"ERROR: {e}")
        traceback.print_exc()

        update_request_status(
            request_id,
            "FAILED"
        )

        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=False
        )


def start_consumer():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT
        )
    )

    channel = connection.channel()

    channel.queue_declare(
        queue=settings.HIGH_TRAINING_QUEUE,
        durable=True
    )

    channel.basic_qos(
        prefetch_count=1
    )

    channel.basic_consume(
        queue=settings.HIGH_TRAINING_QUEUE,
        on_message_callback=process_message
    )

    channel.start_consuming()