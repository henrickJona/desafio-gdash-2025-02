import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginDto } from "./dto/login.dto";
import { UsersService } from "./users.service";
@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() body: Partial<CreateUserDto>) {
    return this.usersService.update(id, body);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }
  @Post("login")
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }
}
