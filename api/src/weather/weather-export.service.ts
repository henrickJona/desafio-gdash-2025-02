import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WeatherLog, WeatherLogDocument } from "./schemas/weather-log.schema";
import { format } from "fast-csv";
import { Writable } from "stream";
import * as ExcelJS from "exceljs";

@Injectable()
export class WeatherExportService {
  constructor(
    @InjectModel(WeatherLog.name)
    private weatherModel: Model<WeatherLogDocument>
  ) {}

  async exportCsv() {
    const rows = await this.weatherModel.find().lean().exec();
    if (!rows.length) return "";

    let csvData = "";
    const writable = new Writable({
      write(chunk, encoding, callback) {
        csvData += chunk.toString();
        callback();
      },
    });

    const stream = format({ headers: true });
    stream.pipe(writable);
    rows.forEach((row) => {
      // remove campos indesejados
      const cleanRow = { ...row };
      delete cleanRow.__v;
      stream.write(cleanRow);
    });
    stream.end();

    await new Promise<void>((resolve) => writable.on("finish", resolve));

    return csvData;
  }

  async exportXlsx() {
    const rows = await this.weatherModel.find().lean().exec();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("weather");

    if (!rows.length) return await workbook.xlsx.writeBuffer();

    const header = Object.keys(rows[0]).filter((k) => k !== "__v");
    sheet.addRow(header);

    rows.forEach((r) => {
      const row = header.map((h) =>
        r[h] instanceof Date ? r[h].toISOString() : r[h]
      );
      sheet.addRow(row);
    });

    return await workbook.xlsx.writeBuffer();
  }
}
