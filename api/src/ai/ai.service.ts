// src/ai/ai.service.ts

import { Injectable, HttpException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { WeatherLogDocument } from "../weather/schemas/weather-log.schema";

@Injectable()
export class AiService {
  // ⭐️ AJUSTE AQUI: Usar a variável de ambiente para o host ⭐️
  private pythonHost = process.env.PYTHON_TRIGGER_HOST;
  private pythonEndpoint = "/analyze";

  constructor(private readonly http: HttpService) {
    if (!this.pythonHost) {
      console.error(
        "AVISO: PYTHON_TRIGGER_HOST não está definido. Usando localhost como fallback."
      );
      this.pythonHost = "http://localhost:8000"; // Fallback apenas em desenvolvimento local
    }
  }

  async generateInsights(logs: WeatherLogDocument[]) {
    // Constrói a URL completa usando o host do ambiente
    const fullUrl = `${this.pythonHost}${this.pythonEndpoint}`;

    try {
      // Mapeia os logs para o formato esperado pelo FastAPI
      const payload = logs.map((log) => ({
        stationId: log.stationId,
        timestamp: log.timestamp?.toISOString(),
        temperature: log.temperature,
        humidity: log.humidity,
        pressure: log.pressure,
        extra: log.extra ?? null,
      }));

      // ⭐️ Chamada usando a URL dinâmica do ambiente (http://python-service:5005/analyze) ⭐️
      const response = await firstValueFrom(
        this.http.post(fullUrl, { records: payload })
      );

      return response.data;
    } catch (error) {
      console.error(
        `Erro ao chamar o serviço Python em ${fullUrl}:`,
        error.message
      );

      // Lança exceção com detalhes para depuração
      throw new HttpException(
        "Erro ao comunicar com o serviço Python de IA",
        500
      );
    }
  }
}
