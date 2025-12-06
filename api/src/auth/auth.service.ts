import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const match = await bcrypt.compare(pass, user.password);

    if (!match) {
      throw new UnauthorizedException("Credenciais inválidas.");
    }

    const { password, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id || user.id,
        email: user.email,
      },
    };
  }
}
