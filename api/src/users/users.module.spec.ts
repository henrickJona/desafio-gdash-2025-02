// ... (imports)
import { UsersModule } from "./users.module";
import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { MailService } from "src/mail/mail.service";
import { getModelToken } from "@nestjs/mongoose"; // Importante para mockar o Mongoose Model
import { User } from "./schemas/user.schema";

// Mock do UsersService (mantido para verificar o onModuleInit)
const mockUsersService = {
  ensureDefaultAdmin: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
};

// Mock do Mongoose Model
const mockUserModel = {
  findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
  constructor: jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue(data),
  })),
};

// Mock do MailService
const mockMailService = {
  sendPasswordEmail: jest.fn(),
};

describe("UsersModule Integration/Module Test", () => {
  let service: UsersService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      // CORREÇÃO: Usamos overrideProvider para mockar as injeções reais

      // 1. Mock do UsersService (para testar o onModuleInit)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)

      // 2. Mock do Mongoose Model (token do User)
      .overrideProvider(getModelToken(User.name))
      .useValue(mockUserModel)

      // 3. Mock do MailService (injetado no UsersService)
      .overrideProvider(MailService)
      .useValue(mockMailService)

      // NOTA: Não precisamos mockar o JwtModule/AuthModule se o UsersModule não
      // injeta o AuthService diretamente no UsersService. Se injetasse, faríamos:
      // .overrideProvider(AuthService).useValue({...})

      .compile();

    // 4. Inicializa o Módulo, disparando o hook onModuleInit
    await module.init();

    service = module.get<UsersService>(UsersService);
  });

  // ... (Testes de expect)

  it("deve garantir que ensureDefaultAdmin seja chamado durante a inicialização do módulo", () => {
    // Verifica se a função no mock do serviço foi chamada
    expect(service.ensureDefaultAdmin).toHaveBeenCalledTimes(1);
  });

  it("o módulo deve compilar corretamente", () => {
    expect(service).toBeDefined();
  });
});
