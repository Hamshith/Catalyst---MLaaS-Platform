import json

import pika

from app.core.config import settings

from app.services.routing_service import (
    determine_training_tier
)

from app.services.rabbitmq_service import (
    publish_to_low_queue,
    publish_to_medium_queue,
    publish_to_high_queue
)


def process_message(
    ch,
    method,
    properties,
    body
):
    request = json.loads(body)

    try:
        tier = determine_training_tier(
            request
        )

        if tier == "low":

            publish_to_low_queue(
                request
            )

        elif tier == "medium":

            publish_to_medium_queue(
                request
            )

        else:

            publish_to_high_queue(
                request
            )

        ch.basic_ack(
            delivery_tag=method.delivery_tag
        )

    except Exception:
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
        queue=settings.TRAINING_QUEUE,
        durable=True
    )

    channel.basic_qos(
        prefetch_count=1
    )

    channel.basic_consume(
        queue=settings.TRAINING_QUEUE,
        on_message_callback=process_message
    )

    channel.start_consuming()