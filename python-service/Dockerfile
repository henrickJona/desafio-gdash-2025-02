# Base Python
FROM python:3.11-slim

# Evitar .pyc e habilitar output instantâneo
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Diretório do app
WORKDIR /app

# Dependências do sistema para pandas/numpy
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primeiro (cache do Docker)
COPY requirements.txt /app/

# Instalar dependências Python
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copiar todo o código da aplicação
COPY . /app/

# Porta do serviço Python
EXPOSE 5005

# Comando para rodar FastAPI com uvicorn
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5005"]
