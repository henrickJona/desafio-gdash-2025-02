# server.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
# Importa a lógica de coleta (Sem Key)
from weather_collector_api import get_data_from_open_meteo 
# Importa a lógica de enfileiramento (do seu arquivo collector.py)
from collector import handle_new_log 
# Seus imports de insights
from ai_engine import DataCollector, AIGenerator

app = FastAPI()

# Modelo de dados para o endpoint de insights (Síncrono)
class AnalysisRequest(BaseModel):
    records: list

# Endpoint 1: Insights (Síncrono) - Chamado pelo Frontend/NestJS para relatórios
@app.post("/analyze")
def analyze(req: AnalysisRequest):
    """
    Recebe dados via HTTP, processa com Pandas/AI e retorna insights.
    """
    try:
        collector = DataCollector(req.dict())
        df = collector.df

        ai = AIGenerator(df)
        
        return {
            "summary": collector.summarize(),
            "insights": ai.generate_insights()
        }
    except Exception as e:
        # Erro de processamento de insights
        raise HTTPException(status_code=500, detail=f"Erro no processamento de insights: {e}")


# ⭐️ Endpoint 2: Trigger de Coleta (Assíncrono) - Chamado pelo NestJS Cron Job ⭐️
@app.post("/trigger-collection")
def trigger_collection_and_enqueue():
    """
    Disparado pelo NestJS Cron. Coleta dados do Open-Meteo e envia para o RabbitMQ.
    """
    print("Requisição de Agendamento recebida do NestJS. Iniciando coleta...")
    
    try:
        # 1. COLETAR DADOS EXTERNOS
        raw_data = get_data_from_open_meteo() 
        
        # 2. PREPARAR PAYLOAD para o Worker Go (Adicionar contador de retry)
        payload_for_rabbit = {**raw_data, "retryCount": 0} 
        
        # 3. ENFILEIRAR (chama sua função de envio)
        handle_new_log(payload_for_rabbit) 
        
        print("Mensagem de clima enviada para o RabbitMQ.")
        
        return {"status": "Accepted", "message": "Coleta disparada e mensagem enviada ao RabbitMQ."}, 202
        
    except Exception as e:
        # Erro de coleta (HTTP, RabbitMQ, etc.)
        print(f"❌ Erro ao processar trigger: {e}")
        raise HTTPException(status_code=500, detail=f"Falha no processo de coleta/enfileiramento: {e}")

# Para rodar com Uvicorn ou Gunicorn (exemplo de bloco main)
if __name__ == '__main__':
    import uvicorn
    # A porta 5005 é a porta interna do container (PYTHON_PORT)
    uvicorn.run(app, host="0.0.0.0", port=5005)