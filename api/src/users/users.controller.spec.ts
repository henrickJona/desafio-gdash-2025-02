import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./../auth/auth.service";
import { JwtAuthGuard } from "./../common/guards/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";

// 1. Definição dos Mocks

// Mock do UsersService
const mockUsersService = {
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  create: jest.fn(),
};

// Mock do AuthService
const mockAuthService = {
  validateUser: jest.fn(),
  login: jest.fn(),
};

// Dados de teste
const mockUser = { id: "testId", name: "Test User", email: "test@example.com" };

describe("UsersController", () => {
  let controller: UsersController;
  let usersService: typeof mockUsersService;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    // 2. Configuração do Módulo de Teste
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // Substitui o UsersService real pelo mock
        { provide: UsersService, useValue: mockUsersService },
        // Substitui o AuthService real pelo mock
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
      // 3. Mocka o AuthGuard para o teste de isolamento
      // Isso impede que o Jest tente carregar a lógica real do Guard
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true }) // Simula que o Guard sempre permite a ativação
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
    authService = module.get(AuthService);

    jest.clearAllMocks();
  });

  it("deve estar definido", () => {
    expect(controller).toBeDefined();
  });

  // ---------------------------------------------
  // Teste de Rotas Protegidas (GET, PATCH, DELETE)
  // ---------------------------------------------

  describe("findAll (GET /users)", () => {
    it("deve chamar usersService.findAll e retornar a lista de usuários", async () => {
      const mockUsers = [mockUser, { ...mockUser, id: "2", email: "b@b.com" }];
      usersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(usersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findOne (GET /users/:id)", () => {
    it("deve chamar usersService.findById com o ID correto", async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const id = "testId";
      const result = await controller.findOne(id);

      expect(usersService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockUser);
    });
  });

  describe("update (PATCH /users/:id)", () => {
    it("deve chamar usersService.update com o ID e DTO corretos", async () => {
      const updateDto: Partial<CreateUserDto> = { name: "Updated Name" };
      const updatedUser = { ...mockUser, name: "Updated Name" };
      usersService.update.mockResolvedValue(updatedUser);

      const id = "testId";
      const result = await controller.update(id, updateDto);

      expect(usersService.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe("remove (DELETE /users/:id)", () => {
    it("deve chamar usersService.remove com o ID correto", async () => {
      usersService.remove.mockResolvedValue(true);

      const id = "testId";
      const result = await controller.remove(id);

      expect(usersService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });

  // ---------------------------------------------
  // Teste de Rotas Públicas (POST)
  // ---------------------------------------------

  describe("create (POST /users)", () => {
    it("deve chamar usersService.create com o DTO de criação", async () => {
      const createDto: CreateUserDto = {
        name: "New User",
        email: "new@example.com",
      };
      usersService.create.mockResolvedValue(mockUser);

      await controller.create(createDto);

      expect(usersService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe("login (POST /users/login)", () => {
    const loginDto = { email: "test@example.com", password: "password" };

    it("deve chamar authService.validateUser e authService.login", async () => {
      // 1. Simula a validação bem-sucedida
      authService.validateUser.mockResolvedValue(mockUser);
      // 2. Simula a geração do token/login
      const token = { access_token: "mock_jwt_token", user: mockUser };
      authService.login.mockResolvedValue(token);

      const result = await controller.login(loginDto);

      // Verifica se a validação foi feita
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );

      // Verifica se o login foi feito com o objeto de usuário retornado
      expect(authService.login).toHaveBeenCalledWith(mockUser);

      // Verifica o resultado final
      expect(result).toEqual(token);
    });

    it("deve propagar o erro se a validação falhar", async () => {
      // Se validateUser falhar (ex: retorna null ou lança UnauthorizedException),
      // o NestJS/AuthService lidaria com isso, mas aqui simulamos o fluxo do serviço
      authService.validateUser.mockRejectedValue(
        new Error("Credenciais inválidas")
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        "Credenciais inválidas"
      );

      // O login não deve ser chamado
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});
