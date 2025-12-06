import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
export type WeatherLogDocument = WeatherLog & Document;
@Schema({ timestamps: true })
export class WeatherLog {
  @Prop({ required: true })
  stationId: string;
  @Prop({ required: true })
  timestamp: Date;
  @Prop()
  temperature: number;
  @Prop()
  humidity: number;
  @Prop()
  pressure: number;
  @Prop({ type: Object, default: {} })
  extra: Record<string, any>;
}
export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
