package main

import (
    "log"
    "os"

    amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
    rabbitURL := os.Getenv("RABBITMQ_URL")
    queueName := os.Getenv("RABBITMQ_QUEUE")
    apiURL := os.Getenv("NEST_API_URL")

    conn, err := amqp.Dial(rabbitURL)
    if err != nil {
        log.Fatalf("🔥 Erro conectando RabbitMQ: %v", err)
    }
    defer conn.Close()

    ch, err := conn.Channel()
    if err != nil {
        log.Fatalf("🔥 Erro abrindo canal: %v", err)
    }
    defer ch.Close()

    StartWorker(ch, queueName, apiURL)
}
