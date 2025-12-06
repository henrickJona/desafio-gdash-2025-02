import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { CreateWeatherLogDto } from "./dto/create-weather-log.dto";
import { WeatherExportService } from "./weather-export.service";
import { WeatherInsightService } from "./weather-insight.service";
import { WeatherService } from "./weather.service";

@Controller("weather")
export class WeatherController {
  constructor(
    private weatherService: WeatherService,
    private exportService: WeatherExportService,
    private insightService: WeatherInsightService
  ) {}

  // Worker Go envia logs aqui (sem auth)
  @Post("logs")
  async createLog(@Body() body: CreateWeatherLogDto) {
    const saved = await this.weatherService.create(body);

    // dispara geração de insight assíncrona (opcional)
    this.insightService.generateInsightsOnNewData(saved);

    return saved;
  }

  @Get("logs")
  async list(@Query("limit") limit = "100", @Query("skip") skip = "0") {
    return this.weatherService.findAll(parseInt(limit, 10), parseInt(skip, 10));
  }

  @Get("logs/:id")
  async detail(@Param("id") id: string) {
    return this.weatherService.findById(id);
  }

  @Get("export.csv")
  async exportCsv(@Res() res: Response) {
    const csv = await this.exportService.exportCsv();
    res.header("Content-Type", "text/csv");
    res.send(csv);
  }

  @Get("export.xlsx")
  async exportXlsx(@Res() res: Response) {
    const buf = await this.exportService.exportXlsx();
    res.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buf);
  }

  // 🔥 Agora usando o Python — sem prompt, sem OpenAI
  @Post("insights")
  async generateInsights() {
    // chama o WeatherInsightService para gerar e armazenar
    const text = await this.insightService.generateInsightsOnNewData(null);
    return { text };
  }

  @Get("insights")
  async getLatestInsight() {
    const r = await this.insightService.getLatest();
    return r[0] || null;
  }
}
