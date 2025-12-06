import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AiModule } from "../ai/ai.module";
import { WeatherController } from "./weather.controller";
import { WeatherExportService } from "./weather-export.service";
import { WeatherInsightService } from "./weather-insight.service";
import { WeatherService } from "./weather.service";
import { WeatherLog, WeatherLogSchema } from "./schemas/weather-log.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
    AiModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherExportService, WeatherInsightService],
  exports: [WeatherService],
})
export class WeatherModule {}
