import { UsersService } from "./users.service";
import { Role, User } from "./schemas/user.schema";
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from "@nestjs/mongoose";
import { plainToInstance } from "class-transformer";
import { UserResponseDTO } from "./dto/user-response.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UpdateUserDTO } from "./dto/update-user.dto";
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;

  beforeEach(async () => {
    mockUserModel = {
      findByIdAndDelete: jest.fn().mockResolvedValue(null),
      findByIdAndUpdate: jest.fn().mockResolvedValue(null),
      findById: jest.fn().mockResolvedValue(null),
      findOne: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      save: jest.fn(),
      toObject: jest.fn(),
    };

    jest.mock('src/utils/parse-id.util', () => ({
      parseId: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os usuarios', async () => {
    const mockUsers = [
      { name: 'Thiago', email: 'thiago@teste.com', password: 'senha123', role: 'USER' },
      { name: 'Thiago Teste', email: 'th@teste.com', password: 'senha321', role: 'USER' },
    ];

    const transformedUsers = plainToInstance(UserResponseDTO, mockUsers, { excludeExtraneousValues: true });

    mockUserModel.exec.mockResolvedValue(mockUsers);

    const result = await service.findAll();

    expect(result).toEqual({ users: transformedUsers });
    expect(mockUserModel.find).toHaveBeenCalled();
    expect(mockUserModel.exec).toHaveBeenCalled();
  });

  it('deve lançar um erro se o banco de dados falhar', async () => {
    mockUserModel.exec.mockRejectedValue(new Error('Erro no banco'));

    await expect(service.findAll()).rejects.toThrow('Erro no banco');

    expect(mockUserModel.find).toHaveBeenCalled();
    expect(mockUserModel.exec).toHaveBeenCalled();
  });

  it('deve criar um usuário corretamente', async () => {
    const createUserDTO: CreateUserDTO = {
      name: 'Thiago',
      email: 'thiago@teste.com',
      password: 'senha123',
    };

    const createdUser = {
      ...createUserDTO,
      role: Role.USER,
      toObject: jest.fn().mockReturnValue({
        name: createUserDTO.name,
        email: createUserDTO.email,
        password: createUserDTO.password,
        role: Role.USER,
      }),
    };

    mockUserModel.create = jest.fn().mockResolvedValue(createdUser);

    const result = await service.createUser(createUserDTO);

    expect(mockUserModel.create).toHaveBeenCalledWith({
      ...createUserDTO,
      role: Role.USER,
    });

    expect(result).toEqual({
      name: createUserDTO.name,
      email: createUserDTO.email,
      password: createUserDTO.password,
      role: Role.USER,
    });
  });

  it('deve lançar um erro se o create falhar', async () => {
    const createUserDTO: CreateUserDTO = {
      name: 'Erro User',
      email: 'erro@teste.com',
      password: 'senha123',
    };

    mockUserModel.create = jest.fn().mockRejectedValue(new Error('Erro ao salvar o usuário no banco.'));

    await expect(service.createUser(createUserDTO)).rejects.toThrow('Erro ao salvar o usuário no banco.');
    expect(mockUserModel.create).toHaveBeenCalled();
  });

  it('deve retornar um usuário quando encontrado pelo email.', async () => {
    const mockUser = {
      name: 'Thiago',
      email: 'thiago@teste.com',
      password: 'senha123',
      role: 'USER'
    };

    mockUserModel.exec.mockResolvedValue(mockUser);

    const result = await service.findUserByEmail('thiago@teste.com');
    
    expect(result).toEqual(mockUser);
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'thiago@teste.com' });
    expect(mockUserModel.exec).toHaveBeenCalled();
  });

  it('deve retornar null quando o usuário não for encontrado.', async () => {
    mockUserModel.exec.mockResolvedValue(null);

    const result = await service.findUserByEmail('naoexiste@hotmail.com');

    expect(result).toBeNull();
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'naoexiste@hotmail.com' });
    expect(mockUserModel.exec).toHaveBeenCalled();
  });

  it('deve lançar um erro se ocorrer um erro na execução', async () => {
    mockUserModel.exec.mockRejectedValue(new Error('Erro ao buscar o usuário.'));

    await expect(service.findUserByEmail('thiago@teste.com')).rejects.toThrow('Erro ao buscar o usuário.');
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'thiago@teste.com' });
    expect(mockUserModel.exec).toHaveBeenCalled();
  });

  it('deve retornar um usuário quando encontrado pelo ID.', async () => {
    const mockUser = {
      name: 'Thiago',
      email: 'thiago@teste.com',
      password: 'senha123',
      role: 'USER'
    };

    const userId = '507f1f77bcf86cd799439011';

    mockUserModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    const transformedUser = plainToInstance(UserResponseDTO, mockUser, {
      excludeExtraneousValues: true,
    });

    const result = await service.findUserById(userId);

    expect(result).toEqual({ user: transformedUser });
    expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
    expect(mockUserModel.findById().exec).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException quando o usuário não for encontrado.', async () => {
    const nonExistingUserId = '507f1f77bcf86cd799439011';

    mockUserModel.findById = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.findUserById(nonExistingUserId)).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
  });

  it('deve lançar BadRequestException se o ID fornecido não for válido.', async () => {
    const invalidUserId  = 'invalid-user-id';

    await expect(service.findUserById(invalidUserId)).rejects.toThrow(new BadRequestException('O ID fornecido não é válido.'));
  });

  it('deve atualizar os dados do usuário corretamente', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const updateUserDTO: UpdateUserDTO = {
      name: 'Usuario Atualizado',
      email: 'usuarioatualizado@teste.com',
      password: '123456',
    };

    const updatedUser = {
      ...updateUserDTO,
      role: Role.USER,
      save: jest.fn().mockReturnValue(undefined),
      toObject: jest.fn().mockResolvedValue({
        name: updateUserDTO.name,
        email: updateUserDTO.email,
        password: updateUserDTO.password,
        role: Role.USER,
      }),
    };

    mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedUser),
    });

    const result = await service.updateUser(userId, updatedUser);

    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updatedUser, { new: true });
    expect(result).toMatchObject({
      name: updateUserDTO.name,
      email: updateUserDTO.email,
      role: Role.USER,
    });
  });

  it('deve lançar NotFoundException quando o usuário não for encontrado', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const updateUserDTO: UpdateUserDTO = { name: 'Novo Nome' };

    mockUserModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.updateUser(userId, updateUserDTO)).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
  });

  it('deve lançar BadRequestException se a senha for menor que 6 caracteres.', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const updateUserDTO: UpdateUserDTO = { password: '12345' };

    await expect(service.updateUser(userId, updateUserDTO)).rejects.toThrow(
      new BadRequestException('A senha deve conter no mínimo 6 caracteres.')
    );
  });
  
  it('deve deletar um usuário corretamente', async () => {
    const userId = '507f1f77bcf86cd799439011';

    const user = { id: userId, name: 'Usuário Teste' };
    mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(user),
    })

    await service.deleteUser(userId);

    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(userId);
  })

  it('deve lançar NotFoundException se o usuário não for encontrado.', async () => {
    const userId = '507f1f77bcf86cd799439011';

    mockUserModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.deleteUser(userId)).rejects.toThrow(new NotFoundException('Usuário não encontrado.'));
  })

  it('deve retornar true quando as senhas coincidirem', async () => {
    const providedPassword = 'password123';
    const storedPassword = await bcrypt.hash(providedPassword, 10);

    const result = await service.comparePassword(providedPassword, storedPassword);

    expect(result).toBe(true);
  })

  it('deve retornar true quando as senhas coincidirem', async () => {
    const providedPassword = 'password123';
    const storedPassword = await bcrypt.hash('password', 10);

    const result = await service.comparePassword(providedPassword, storedPassword);

    expect(result).toBe(false);
  })

});
