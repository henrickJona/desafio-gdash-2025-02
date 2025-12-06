package main

import (
    "encoding/json"
    "log"
    "time"

    amqp "github.com/rabbitmq/amqp091-go"
)

const MaxRetries = 3
const RetryDelay = 5 * time.Second

func StartWorker(ch *amqp.Channel, queueName, apiURL string) {
    _, err := ch.QueueDeclare(
    queueName, // nome da fila
    true,      // durable: a fila persiste mesmo se o RabbitMQ reiniciar
    false,     // autoDelete
    false,     // exclusive
    false,     // noWait
    nil,       // arguments
)
if err != nil {
    log.Fatalf("🔥 Error declaring queue: %v", err)
}
    msgs, err := ch.Consume(
        queueName,
        "",
        false, // manual ack
        false,
        false,
        false,
        nil,
    )
    if err != nil {
        log.Fatalf("🔥 Error starting consumer: %v", err)
    }

    log.Println("🚀 Worker Go iniciado. Aguardando mensagens...")

    for msg := range msgs {
        var weather WeatherMessage

        err := json.Unmarshal(msg.Body, &weather)
        if err != nil {
            log.Printf("❌ JSON inválido: %v", err)
            msg.Nack(false, false)
            continue
        }

        log.Printf("📩 Mensagem recebida: %+v", weather)

        err = SendToAPI(apiURL, weather)
        if err != nil {
            if weather.RetryCount >= MaxRetries {
                log.Printf("❌ Max retries atingido para: %+v", weather)
                msg.Nack(false, false)
            } else {
                weather.RetryCount++
                log.Printf("⚠️ Retry %d para mensagem: %+v", weather.RetryCount, weather)

                time.Sleep(RetryDelay)

                updatedBody, _ := json.Marshal(weather)
                ch.Publish(
                    "",        // exchange default
                    queueName, // mesma fila
                    false,
                    false,
                    amqp.Publishing{
                        ContentType: "application/json",
                        Body:        updatedBody,
                    },
                )
                msg.Ack(false)
            }
            continue
        }

        msg.Ack(false)
        log.Println("✅ Processado com sucesso!")
    }
}
