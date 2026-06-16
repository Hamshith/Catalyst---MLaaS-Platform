import json
import os
import tempfile
import traceback

import pika

from app.core.config import settings

from app.services.dataset_service import (
    get_dataset_by_id
)

from app.services.request_service import (
    get_request_by_id,
    update_request_status,
    update_processed_dataset_path
)

from app.services.minio_service import (
    download_file,
    upload_file
)

from app.services.rabbitmq_service import (
    publish_to_training_queue
)

from app.services.preprocessing_service import (
    preprocess_dataset
)


def process_message(
    ch,
    method,
    properties,
    body
):
    print(f"Received message: {body}")
    message = json.loads(body)

    request_id = message["request_id"]

    try:
        request = get_request_by_id(
            request_id
        )

        dataset = get_dataset_by_id(
            request["dataset_id"]
        )

        update_request_status(
            request_id,
            "PREPROCESSING"
        )

        with tempfile.TemporaryDirectory() as temp_dir:

            input_file = os.path.join(
                temp_dir,
                "input.csv"
            )

            output_file = os.path.join(
                temp_dir,
                "processed.csv"
            )

            download_file(
                dataset["storage_path"],
                input_file
            )

            preprocessing_result = (
                preprocess_dataset(
                    input_file=input_file,
                    output_file=output_file,
                    request=request
                )
            )

            test_start_row = (
                preprocessing_result[
                    "test_start_row"
                ]
            )

            processed_object_name = (
                f"processed/{request_id}.csv"
            )

            upload_file(
                processed_object_name,
                output_file
            )

        update_processed_dataset_path(
            request_id,
            processed_object_name
        )

        update_request_status(
            request_id,
            "TRAINING"
        )

        publish_to_training_queue(
            {
                "request_id": request_id,
                "dataset_id": str(
                    request["dataset_id"]
                ),
                "user_id": str(
                    request["user_id"]
                ),
                "processed_dataset_path": (
                    processed_object_name
                ),
                "test_start_row": (
                    test_start_row
                ),
                "learning_type": (
                    request["learning_type"]
                ),
                "problem_type": (
                    request.get(
                        "problem_type"
                    )
                ),
                "target_column": (
                    request.get(
                        "target_column"
                    )
                ),
                "classification_model": (
                    request.get(
                        "classification_model"
                    )
                ),
                "regression_model": (
                    request.get(
                        "regression_model"
                    )
                ),
                "unsupervised_model": (
                    request.get(
                        "unsupervised_model"
                    )
                )
            }
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
        queue=settings.REQUEST_QUEUE,
        durable=True
    )

    channel.basic_qos(
        prefetch_count=1
    )

    channel.basic_consume(
        queue=settings.REQUEST_QUEUE,
        on_message_callback=process_message
    )

    channel.start_consuming()