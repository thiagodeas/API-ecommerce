import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDTO } from "src/users/dto/login-user.dto";
import * as bcrypt from 'bcryptjs';
import { UserResponseDTO } from "src/users/dto/user-response.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "src/users/dto/create-user.dto";
import { plainToInstance } from "class-transformer";

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
  }));

describe('AuthService', () => {
    let service: AuthService;
    let mockUsersService: any;
    let mockJwtService: any;

    beforeEach(async () => {
        mockUsersService = {
            findUserByEmail: jest.fn(),
            findUserById: jest.fn(),
            createUser: jest.fn(),
        };

        mockJwtService = {
            sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService, useValue: mockUsersService,
                },
                {
                    provide: JwtService, useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve fazer login com sucesso.', async () => {
        const loginUserDto: LoginUserDTO = {
            email: 'test@hotmail.com',
            password: 'senha123',
        };

        const user = {
            _id: '1', 
            email: 'test@hotmail.com',
            password: 'senha123',
            toObject: () => ({
                id: '1', 
                email: 'test@hotmail.com',
                password: 'senha123'
            }),
        };

        mockUsersService.findUserByEmail = jest.fn().mockResolvedValue(user);

        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        mockJwtService.sign = jest.fn().mockReturnValue('validToken');

        const result = await service.login(loginUserDto);

        expect(result).toEqual({
            user: expect.any(UserResponseDTO),
            accessToken: 'validToken',
        });

        expect(mockUsersService.findUserByEmail).toHaveBeenCalledWith('test@hotmail.com');
    });

    it('deve lançar BadRequestException se email ou senha estiverem faltando.', async () => {
        await expect(service.login({email: '', password: ''})).rejects.toThrow(new BadRequestException('E-mail e senha são obrigatórios.'));
    });

    it('deve lançar NotFoundException se o usuário não for encontrado.', async () => {
        mockUsersService.findUserByEmail = jest.fn().mockResolvedValue(null);

        await expect(service.login({ email: 'teste@hotmail.com', password: '123' })).rejects.toThrow(new NotFoundException('Usuário não encontrado!'));
    });

    it('deve lançar BadRequestException se a senha for inválida.', async () => {
        mockUsersService.findUserByEmail = jest.fn().mockResolvedValue({ password: 'hashedPassword' });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(service.login({ email: 'teste@hotmail.com', password: '123' })).rejects.toThrow(new BadRequestException('Senha inválida!'));
    });

    it('deve registrar um novo usuário com sucesso', async () => {
        const createUserDTO: CreateUserDTO = {
            name: 'Nome Teste',
            email: 'teste@hotmail.com',
            password: '123456',
        };

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-Password');

        const createdUser = {
            name: createUserDTO.name,
            email: createUserDTO.email,
            password: 'hashed-Password',
        };

        mockUsersService.createUser = jest.fn().mockResolvedValue(createdUser);

        const result = await service.register(createUserDTO);
        
        expect(result).toEqual({user: plainToInstance(UserResponseDTO, createdUser)});
    });

    it('deve lançar BadRequestException se o e-email já estiver em uso.', async () => {
        const createUserDTO: CreateUserDTO = {
            name: 'Nome Teste',
            email: 'teste@hotmail.com',
            password: '123456',
        };

        const user = {
            name: 'Teste',
            email: 'teste@teste.com',
            password: 'password123',
        };

        mockUsersService.findUserByEmail = jest.fn().mockResolvedValue(user);
        await expect(service.register(createUserDTO)).rejects.toThrow(new BadRequestException('Email já está em uso!'));
    });

    it('deve lançar BadRequestException se a senha for menor que 6 caracteres.', async () => {
        const createUserDTO: CreateUserDTO = {
            name: 'Nome Teste',
            email: 'teste@hotmail.com',
            password: '123',
        };

        mockUsersService.findUserByEmail = jest.fn().mockReturnValue(null);

        await expect(service.register(createUserDTO)).rejects.toThrow(new BadRequestException('A senha deve conter no mínimo 6 caracteres.'));
    });

    it('deve validar o usuário pelo token corretamente', async () => {
        const jwtPayload = {
            userId: 'userIdTeste',
            email: 'teste@hotmail.com',
        };

        const user = {
            name: 'Usuário Teste',
            email: 'teste@hotmail.com',
        }

        mockUsersService.findUserById = jest.fn().mockResolvedValue(user);

        const result = await service.validateUserByJwt(jwtPayload);
        expect(result).toEqual(user);
    })
})