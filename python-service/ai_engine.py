import pandas as pd
from typing import Dict, List, Any

# ⭐️ CLASSE NOVA: DataCollector ⭐️
class DataCollector:
    """
    Transforma a lista de registros JSON (records) em um DataFrame Pandas.
    """
    def __init__(self, raw_data: Dict[str, List[Any]]):
        records = raw_data.get("records", [])
        
        # Cria o DataFrame
        if not records:
            self.df = pd.DataFrame()
        else:
            self.df = pd.DataFrame(records)
            
        # Tenta converter colunas de data/hora se existirem
        if 'timestamp' in self.df.columns:
            self.df['timestamp'] = pd.to_datetime(self.df['timestamp'], errors='coerce')
        
        # Opcional: Adicionar uma função de resumo simples
    def summarize(self) -> str:
        if self.df.empty:
            return "Nenhum dado recebido para análise."
        return f"Dados de {len(self.df)} registros prontos para análise."

class AIGenerator:
    def __init__(self, df: pd.DataFrame):
        self.df = df

    def generate_insights(self):
        insights = {}

        # Temperatura média, min, max
        if "temperature" in self.df:
            insights["temperature"] = {
                "avg": float(self.df["temperature"].mean()),
                "min": float(self.df["temperature"].min()),
                "max": float(self.df["temperature"].max()),
            }

        # Humidade
        if "humidity" in self.df:
            insights["humidity"] = {
                "avg": float(self.df["humidity"].mean()),
                "min": float(self.df["humidity"].min()),
                "max": float(self.df["humidity"].max())
            }

        # Pressão atmosférica
        if "pressure" in self.df:
            insights["pressure"] = {
                "avg": float(self.df["pressure"].mean()),
                "min": float(self.df["pressure"].min()),
                "max": float(self.df["pressure"].max())
            }

        # Estações com mais registros
        if "stationId" in self.df:
            insights["stations"] = (
                self.df["stationId"].value_counts().to_dict()
            )

        # Tendência de temperatura (últimas 12h)
        if "timestamp" in self.df:
            if len(self.df) > 1:
                insights["temperature_trend"] = (
                    "subindo" if self.df["temperature"].iloc[-1] >
                    self.df["temperature"].iloc[0] else "descendo"
                )

        return insights
