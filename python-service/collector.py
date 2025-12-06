# collector.py

from rabbitmq_client import RabbitMQClient



def handle_new_log(data):
    
    rabbit_client = None
    try:
        # 1. Cria a conexão (dentro da chamada)
        rabbit_client = RabbitMQClient() 
        
        # 2. Envia a mensagem
        rabbit_client.send_message(data)
        
    except Exception as e:
        # 3. Se houver erro de conexão, relança para o FastAPI retornar 500
        print(f"❌ ERRO ao enviar mensagem ao RabbitMQ: {e}")
        raise
        
    finally:
        # 4. Garante que a conexão seja fechada, mesmo em caso de erro.
        if rabbit_client:
             rabbit_client.close()