import { Module, OnModuleInit, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "../auth/auth.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User, UserSchema } from "./schemas/user.schema";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // quebra o ciclo
    JwtModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.usersService.ensureDefaultAdmin();
  }
}
