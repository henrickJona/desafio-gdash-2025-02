package main

import (
    "log"
    amqp "github.com/rabbitmq/amqp091-go"
)

func ConnectRabbitMQ(url string) (*amqp.Connection, *amqp.Channel) {
    conn, err := amqp.Dial(url)
    if err != nil {
        log.Fatalf("🔥 RabbitMQ connection error: %v", err)
    }

    ch, err := conn.Channel()
    if err != nil {
        log.Fatalf("🔥 RabbitMQ channel error: %v", err)
    }

    return conn, ch
}

func DeclareQueue(ch *amqp.Channel, queueName string) (amqp.Queue, error) {
    q, err := ch.QueueDeclare(
        queueName,
        true,  // durable
        false, // auto-delete
        false, // exclusive
        false, // no-wait
        nil,
    )

    return q, err
}
