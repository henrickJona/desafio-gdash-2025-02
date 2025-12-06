import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { randomBytes } from "crypto";
import { MailService } from "./../mail/mail.service";
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mailService: MailService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const password = randomBytes(4).toString("hex"); // ex: "9f12ab3c"

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);

    const created = new this.userModel({
      ...createUserDto,
      password: hashed,
    });

    const user = await created.save();

    // envia a senha gerada
    await this.mailService.sendPasswordEmail(createUserDto.email, password);

    return user;
  }
  async findAll() {
    return this.userModel.find().select("-password").exec();
  }
  async findById(id: string) {
    return this.userModel.findById(id).select("-password").exec();
  }
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
  async update(id: string, data: Partial<CreateUserDto>) {
    // Segurança: nunca aceitar senha via update comum
    if ("password" in data) {
      delete data.password;
    }

    // Atualiza apenas os demais campos
    return this.userModel
      .findByIdAndUpdate(id, data, { new: true })
      .select("-password")
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
  async ensureDefaultAdmin() {
    const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
    const pass = process.env.DEFAULT_ADMIN_PASS || "123456";
    const existing = await this.userModel.findOne({ email }).exec();
    if (!existing) {
      this.logger.log("Creating default admin user");
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(pass, salt);
      await new this.userModel({
        name: "Admin",
        email,
        password: hashed,
        isAdmin: true,
      }).save();
    }
  }
}
