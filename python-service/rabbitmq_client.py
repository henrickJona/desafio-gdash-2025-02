import json
import pika
import os

RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE_NAME = os.getenv("RABBITMQ_QUEUE", "weather_logs")

class RabbitMQClient:
    def __init__(self):
        params = pika.URLParameters(RABBITMQ_URL)
        self.connection = pika.BlockingConnection(params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=QUEUE_NAME, durable=True)

    def send_message(self, data: dict):
        payload = json.dumps(data)
        self.channel.basic_publish(
            exchange="",
            routing_key=QUEUE_NAME,
            body=payload,
            properties=pika.BasicProperties(
                delivery_mode=2  # torna a mensagem persistente
            )
        )
        print(f"[RabbitMQ] Mensagem enviada: {payload}")

    def close(self):
        self.connection.close()
