import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"; // <- Import necessário
import { AiService } from "./ai.service";

@Module({
  imports: [HttpModule], // <- agora HttpService estará disponível
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
