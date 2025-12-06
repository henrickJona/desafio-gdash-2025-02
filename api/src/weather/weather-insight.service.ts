import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WeatherLog, WeatherLogDocument } from "./schemas/weather-log.schema";
import { AiService } from "../ai/ai.service";

// Opcional: Se você tiver um Schema dedicado para Insights
export interface WeatherInsightDocument {
  _id?: any;
  generatedAt: Date;
  text: string;
  sampleSize: number;
  raw: any;
}

@Injectable()
export class WeatherInsightService {
  private readonly collectionName = "weather_insights";

  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>,
    private aiService: AiService
  ) {}
  /**
   * Aciona a coleta de dados, chama o serviço Python (Pandas) para análise,
   * e gera o texto descritivo antes de salvar.
   */

  async generateInsightsOnNewData(savedLog: WeatherLogDocument) {
    // Pega os últimos 200 registros do MongoDB
    const logs = await this.weatherModel
      .find()
      .sort({ timestamp: -1 })
      .limit(200)
      .lean()
      .exec(); // 🔥 Chamamos o Python (Pandas) passando os logs. // Ele retorna um objeto { insights: {...}, summary: "..." }

    const response = await this.aiService.generateInsights(logs); // ⭐️ 1. Geração do Texto Descritivo: Usando os dados calculados pelo Pandas ⭐️
    const insightText = this.generateDescriptiveText(response.insights); // Salva no MongoDB na collection weather_insights

    const db = this.weatherModel.db;
    await db.collection(this.collectionName).insertOne({
      generatedAt: new Date(),
      text: insightText, // <-- Campo "text" preenchido com a análise
      sampleSize: logs.length,
      raw: response, // Guardamos todos os dados brutos de estatística
    });

    return insightText;
  }
  /**
   * Converte o objeto estatístico (insights) em uma string amigável (sem LLM).
   * @param insights Dados estatísticos calculados pelo Pandas.
   */

  private generateDescriptiveText(insights: any): string {
    const temp = insights?.temperature;
    const hum = insights?.humidity;
    const press = insights?.pressure; // --- Validação e Retorno Padrão ---

    if (!temp || temp.avg <= 0) {
      return "Análise temporariamente indisponível. Dados primários ausentes ou inválidos.";
    } // --- Construção do Texto ---

    let text = `A temperatura média registrada foi de **${temp.avg.toFixed(
      1
    )}°C**, variando entre a mínima de ${temp.min.toFixed(
      1
    )}°C e a máxima de ${temp.max.toFixed(1)}°C.`;

    if (insights.temperature_trend) {
      text += ` A tendência geral de temperatura é de **${insights.temperature_trend}**.`;
    }

    if (hum && hum.avg > 0) {
      text += ` A umidade média do ar foi de ${hum.avg.toFixed(0)}%.`;
    }
    if (press && press.avg > 0) {
      text += ` A pressão atmosférica média é de ${press.avg.toFixed(2)} hPa.`;
    }
    const stationId = Object.keys(insights.stations)[0];
    text += ` (Dados de ${insights.stations[stationId]} registros da estação ${stationId}).`;

    return text;
  }
  /**
   * Retorna o último insight gerado.
   */

  async getLatest() {
    const db = this.weatherModel.db;

    return db
      .collection(this.collectionName)
      .find()
      .sort({ generatedAt: -1 })
      .limit(1)
      .toArray();
  }
}
