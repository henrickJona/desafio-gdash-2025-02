import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AiService } from "./ai.service";
import {
  WeatherLog,
  WeatherLogDocument,
} from "../weather/schemas/weather-log.schema";

@Controller("ai")
export class AiController {
  constructor(
    private readonly aiService: AiService,
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>
  ) {}

  @Get("insights")
  async getInsights() {
    const logs = await this.weatherModel.find().lean();
    return this.aiService.generateInsights(logs);
  }
}
