// app.module.ts (Atualizado)

import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule"; // 👈 NOVO: Habilita Cron globalmente

import { UsersModule } from "./users/users.module";
import { WeatherModule } from "./weather/weather.module";
import { PokemonModule } from "./integration/pokemon.module";
import { AiModule } from "./ai/ai.module";
import { CollectorModule } from "./collector/collector.module"; // 👈 NOVO: Importa o módulo de disparo
import { MailModule } from "./mail/mail.module";

@Module({
  imports: [
    ScheduleModule.forRoot(), // Registra o módulo de agendamento

    MongooseModule.forRoot(
      process.env.MONGODB_URI || "mongodb://localhost:27017/nest_weather"
    ),
    UsersModule,
    WeatherModule,
    PokemonModule,
    AiModule,
    CollectorModule,
    MailModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {}
}
