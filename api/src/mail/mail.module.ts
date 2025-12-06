import { Module } from "@nestjs/common";
import { MailService } from "./mail.service";

@Module({
  providers: [MailService],
  exports: [MailService], // <- isto permite usar no UsersService
})
export class MailModule {}
