// src/collector/collector-http.service.ts

import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class CollectorHttpService {
  // ⭐️ CORREÇÃO AQUI: A URL base deve vir da variável de ambiente ⭐️
  private readonly PYTHON_BASE_HOST = process.env.PYTHON_TRIGGER_HOST;
  private readonly TRIGGER_ENDPOINT = "/trigger-collection";

  constructor(private readonly httpService: HttpService) {}

  @Cron("*/3 * * * *")
  async handleHttpTrigger() {
    if (!this.PYTHON_BASE_HOST) {
      console.error(
        "❌ FATAL: Variável PYTHON_TRIGGER_HOST não configurada. O Cron não pode disparar o Python."
      );
      return;
    }

    const fullUrl = `${this.PYTHON_BASE_HOST}${this.TRIGGER_ENDPOINT}`;
    console.log(`--- CRON JOB: Disparando o trigger Python em ${fullUrl} ---`);

    try {
      // Faz o POST para o endpoint FastAPI
      await firstValueFrom(this.httpService.post(fullUrl, {}));

      console.log("✅ Trigger enviado com sucesso ao Python.");
    } catch (error) {
      console.error(
        `❌ ERRO no Trigger HTTP: Falha ao chamar o serviço Python em ${fullUrl}`
      );
      // ... (Lógica de erro)
      throw new InternalServerErrorException(
        `Cron Job falhou ao disparar o Python: ${error.message}`
      );
    }
  }
}
