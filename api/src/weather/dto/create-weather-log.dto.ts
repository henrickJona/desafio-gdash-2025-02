import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateWeatherLogDto {
  @IsString()
  stationId: string;
  @IsDateString()
  timestamp: string;
  @IsOptional()
  @IsNumber()
  temperature?: number;
  @IsOptional()
  @IsNumber()
  humidity?: number;
  @IsOptional()
  @IsNumber()
  pressure?: number;
  @IsOptional()
  extra?: any;
}
