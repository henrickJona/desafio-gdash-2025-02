# weather_collector_api.py

import requests
import sys
from typing import Dict, Any
from datetime import datetime

# --- Configurações de Localização (Macapá) ---
# Coordenadas decimais de Macapá (Sul e Oeste)
LATITUDE = 0.0385 
LONGITUDE = -51.0663

def get_data_from_open_meteo() -> Dict[str, Any]:
    """
    Faz a requisição GET para o Open-Meteo (não requer API Key).
    """
    BASE_URL = "https://api.open-meteo.com/v1/forecast"
    
    # Parâmetros: Requisita a temperatura atual, umidade e o código do tempo
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "current": "temperature_2m,relative_humidity_2m,surface_pressure,weather_code",
        "timezone": "America/Sao_Paulo" 
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=20)
        response.raise_for_status() # Levanta erro para 4xx/5xx
        data = response.json()
        
        current = data.get("current", {})
        station_id_value = f"OM_{LATITUDE}_{LONGITUDE}".replace('.', '_')
        # Retorna os dados formatados
        return {"stationId": station_id_value,
            "city_location": f"{LATITUDE},{LONGITUDE}",
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "pressure": current.get("surface_pressure"),
            "weather_code": current.get("weather_code"),
            "timestamp": current.get("time"),
            "source": "Open-Meteo (Keyless)"
        }
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Falha ao conectar à API Open-Meteo: {e}", file=sys.stderr)
        # Lança uma exceção para que o FastAPI capture e retorne 500
        raise Exception(f"External API Error: {e}")