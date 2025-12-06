import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateWeatherLogDto } from "./dto/create-weather-log.dto";
import { WeatherLog, WeatherLogDocument } from "./schemas/weather-log.schema";
import { WeatherInsightService } from "./weather-insight.service";
@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>,
    private insightService: WeatherInsightService
  ) {}
  async create(dto: CreateWeatherLogDto) {
    const doc = new this.weatherModel({
      ...dto,
      timestamp: new Date(dto.timestamp),
    });
    const saved = await doc.save();
    // generate insights asynchronously but not awaited
    this.insightService
      .generateInsightsOnNewData(saved)
      .catch((e) => console.error(e));
    return saved;
  }
  async findAll(limit = 100, skip = 0) {
    return this.weatherModel
      .find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
  async findById(id: string) {
    return this.weatherModel.findById(id).exec();
  }
  async allForPeriod(from: Date, to: Date) {
    return this.weatherModel
      .find({ timestamp: { $gte: from, $lte: to } })
      .exec();
  }
}
