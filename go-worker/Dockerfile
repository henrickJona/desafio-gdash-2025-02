FROM golang:1.22 AS builder

WORKDIR /app

# Copia apenas os arquivos de módulo primeiro
COPY go.mod go.sum ./

# Baixa todas as dependências
RUN go mod download

# Copia o restante do código
COPY . .

# Build do binário
RUN go build -o worker .

# Imagem final mais leve
FROM gcr.io/distroless/base-debian12

WORKDIR /

COPY --from=builder /app/worker .

ENV RABBITMQ_URL=
ENV RABBITMQ_QUEUE=
ENV NEST_API_URL=

CMD ["./worker"]
