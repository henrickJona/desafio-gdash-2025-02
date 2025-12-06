// src/collector/collector.module.ts

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { CollectorHttpService } from "./collector-http.service"; // Seu serviço de Cron Job

@Module({
  imports: [
    // O HttpModule só é importado aqui, onde é usado
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [CollectorHttpService], // O serviço de agendamento é registrado aqui
  exports: [CollectorHttpService], // Opcional, se outros módulos precisarem dele
})
export class CollectorModule {}
