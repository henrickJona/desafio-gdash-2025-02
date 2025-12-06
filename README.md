Microservices Architecture Project
📋 Overview
This project implements a microservices architecture using Docker Compose, integrating multiple technologies to create a robust and scalable application.
🏗️ Architecture
The project consists of the following services:

Frontend: React application (Vite)
API: NestJS backend service
Python Service: Python-based microservice
Go Worker: Go-based background worker
MongoDB: NoSQL database
RabbitMQ: Message broker for asynchronous communication

🚀 Services Description
Frontend (React + Vite)

Container: react-frontend
Port: 5173:80
Technology: React with Vite
Description: User interface for the application
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASS=123456

API (NestJS)

Container: nest-api
Port: 3000:3000
Technology: NestJS (Node.js framework)
Dependencies: MongoDB
Description: Main REST API service

Python Service

Container: python-service
Port: 5005:5005
Technology: Python
Dependencies: MongoDB
Description: Python-based microservice for specific tasks

Go Worker

Container: go-worker
Technology: Go
Dependencies: API, Python Service, MongoDB, RabbitMQ
Description: Background worker for asynchronous task processing

MongoDB

Container: mongo
Port: 27017:27017
Version: 7
Volume: mongo_data:/data/db
Description: Primary database

RabbitMQ

Container: rabbitmq
Ports:

5672:5672 (AMQP protocol)
15672:15672 (Management web interface)

Version: 3-management
Description: Message broker for service communication

📦 Prerequisites

Docker
Docker Compose
Git

⚙️ Configuration
Environment Variables
Create the following .env files:
Root .env (for API)
env# MongoDB
MONGO_URI=mongodb://mongo:27017/your_database

# RabbitMQ

RABBITMQ_URL=amqp://rabbitmq:5672

# API Configuration

PORT=3000
./python-service/.env
env# MongoDB
MONGO_URI=mongodb://mongo:27017/your_database

# RabbitMQ

RABBITMQ_URL=amqp://rabbitmq:5672

# Python Service Configuration

PORT=5005
./go-worker/.env
env# MongoDB
MONGO_URI=mongodb://mongo:27017/your_database

# RabbitMQ

RABBITMQ_URL=amqp://rabbitmq:5672

# API URLs

API_URL=http://nest-api:3000
PYTHON_SERVICE_URL=http://python-service:5005
🚀 Getting Started

1. Clone the repository
   bashgit clone <your-repository-url>
   cd <project-directory>
2. Create environment files
   Create the .env files as described in the Configuration section.
3. Build and start all services
   bashdocker-compose up -d --build
4. Verify services are running
   bashdocker-compose ps
   🔍 Accessing Services
   ServiceURLDescriptionFrontendhttp://localhost:5173Web interfaceAPIhttp://localhost:3000REST API endpointsPython Servicehttp://localhost:5005Python microserviceMongoDBmongodb://localhost:27017Database connectionRabbitMQ AMQPamqp://localhost:5672Message brokerRabbitMQ Managementhttp://localhost:15672RabbitMQ admin panel
   RabbitMQ Default Credentials:

Username: guest
Password: guest

📝 Common Commands
Start all services
bashdocker-compose up -d
Stop all services
bashdocker-compose down
View logs
bash# All services
docker-compose logs -f

# Specific service

docker-compose logs -f <service-name>

# Example: docker-compose logs -f api

Rebuild a specific service
bashdocker-compose up -d --build <service-name>
Restart a service
bashdocker-compose restart <service-name>
Remove all containers and volumes
bashdocker-compose down -v
🗂️ Project Structure
.
├── docker-compose.yml
├── .env
├── api/
│ ├── Dockerfile
│ └── ... (NestJS application files)
├── python-service/
│ ├── Dockerfile
│ ├── .env
│ └── ... (Python application files)
├── go-worker/
│ ├── Dockerfile
│ ├── .env
│ └── ... (Go application files)
└── frontend/
├── Dockerfile
└── ... (React application files)
🔧 Development
Hot Reload
For development with hot reload, you may need to:

Mount source code as volumes in docker-compose.yml
Ensure your Dockerfiles support development mode
Install dependencies locally if needed

Example volume mounting:
yamlapi:
volumes: - ./api:/app - /app/node_modules
🐛 Troubleshooting
Service won't start

Check logs: docker-compose logs <service-name>
Verify environment variables are set correctly
Ensure ports are not already in use

Database connection issues

Verify MongoDB is running: docker-compose ps mongo
Check connection string in environment variables
Ensure services wait for MongoDB to be ready

RabbitMQ connection issues

Verify RabbitMQ is running: docker-compose ps rabbitmq
Check RabbitMQ management interface at http://localhost:15672
Verify AMQP URL in environment variables
