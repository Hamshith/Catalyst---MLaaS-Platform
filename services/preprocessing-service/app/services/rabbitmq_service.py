import json

import pika

from app.core.config import settings


def publish_to_training_queue(
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
        queue=settings.TRAINING_QUEUE,
        durable=True
    )

    channel.basic_publish(
        exchange="",
        routing_key=settings.TRAINING_QUEUE,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )

    connection.close()