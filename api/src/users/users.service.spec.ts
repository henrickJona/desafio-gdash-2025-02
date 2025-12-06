import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import { MailService } from "./../mail/mail.service";

describe("UsersService - create", () => {
  let service: UsersService;

  it("deve criar usuário com senha gerada e enviar email", async () => {
    const mockSave = jest.fn().mockResolvedValue({
      name: "Test User",
      email: "test@example.com",
      _id: "mock-id",
      password: "hashed-password",
    });

    // Mock do construtor
    const MockUserModel = function (data: any) {
      this.data = data;
      this.save = mockSave;
      return this;
    };

    const mockMailService = {
      sendPasswordEmail: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    const result = await service.create({
      name: "Test User",
      email: "test@example.com",
    });

    expect(mockSave).toHaveBeenCalled();
    expect(mockMailService.sendPasswordEmail).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
