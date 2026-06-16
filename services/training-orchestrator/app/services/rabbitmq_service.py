import json

import pika

from app.core.config import settings


def publish_message(
    queue_name: str,
    message: dict
):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=settings.RABBITMQ_HOST,
            port=settings.RABBITMQ_PORT
        )
    )

    channel = connection.channel()

    channel.queue_declare(
        queue=queue_name,
        durable=True
    )

    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )

    connection.close()


def publish_to_low_queue(
    message: dict
):
    publish_message(
        settings.LOW_TRAINING_QUEUE,
        message
    )


def publish_to_medium_queue(
    message: dict
):
    publish_message(
        settings.MEDIUM_TRAINING_QUEUE,
        message
    )


def publish_to_high_queue(
    message: dict
):
    publish_message(
        settings.HIGH_TRAINING_QUEUE,
        message
    )