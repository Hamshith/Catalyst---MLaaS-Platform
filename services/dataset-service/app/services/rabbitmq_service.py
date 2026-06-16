import json
import os
import pika


RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")

QUEUE_NAME = "preprocessing_queue"


def publish_message(message: dict):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST
        )
    )

    channel = connection.channel()

    channel.queue_declare(
        queue=QUEUE_NAME,
        durable=True
    )

    channel.basic_publish(
        exchange="",
        routing_key=QUEUE_NAME,
        body=json.dumps(
            message,
            default=str
        ),
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )

    connection.close()