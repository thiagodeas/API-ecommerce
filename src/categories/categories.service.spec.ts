import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesService } from "./categories.service"
import { getModelToken } from "@nestjs/mongoose";
import { Category } from "./schemas/categories.schema";
import { CreateCategoryDTO } from "./dto/create-category.dto";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { UpdateCategoryDTO } from "./dto/update-category.dto";

describe('CategoriesService', () => {
    let service: CategoriesService;
    let mockCategoryModel: any;

    beforeEach(async () => {
        mockCategoryModel = {
            create: jest.fn(),
            exec: jest.fn(),
            find: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            findOne: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
        }

        jest.mock('src/utils/parse-id.util', () => ({
            parseId: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
          }));

          const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getModelToken(Category.name),
                    useValue: mockCategoryModel,
                },
            ],
          }).compile();

          service = module.get<CategoriesService>(CategoriesService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar todas as categorias', async () => {
        const mockedCategories = [
            {
                id: '67c039fceae9597d6fa80d28',
                name: "Eletrônicos",
                products: [],
                toObject: () => ({
                    id: '67c039fceae9597d6fa80d28',
                    name: "Eletrônicos",
                    products: [],
                }),
            },
            {
                id: '67c039fceae9597d6fa80d28',
                name: "Beleza e Cuidados Pessoais",
                products: [],
                toObject: () => ({
                    id: '67c039fceae9597d6fa80d28',
                    name: "Beleza e Cuidados Pessoais",
                    products: [],
                }),
            },
        ];

        mockCategoryModel.exec = jest.fn().mockResolvedValue(mockedCategories);

        const result = await service.findAll();

        const expectedCategories = mockedCategories.map(cat => cat.toObject());
        expect(result).toEqual({ categories: expectedCategories });
    });

    it('deve criar uma categoria corretamente', async () => {
        const createCategoryDTO: CreateCategoryDTO = {
            name: 'Categoria de Teste',
        };

        const createdCategory = {
            ...createCategoryDTO,
            toObject: () => ({
                name: 'Categoria de Teste'
            }),
        };

        mockCategoryModel.create = jest.fn().mockResolvedValue(createdCategory);

        const result = await service.createCategory(createCategoryDTO);
        const expectedCategory = createdCategory.toObject();
        expect(result).toEqual({ category: expectedCategory });
    });

    it('deve lançar ConflictException se já existir uma categoria criada com o mesmo nome', async () => {
        const createCategoryDTO: CreateCategoryDTO = {
            name: 'Categoria de Teste',
        };

        const createdCategory = {
            ...createCategoryDTO,
            toObject: () => ({
                name: 'Categoria de Teste'
            }),
        };

        mockCategoryModel.exec = jest.fn().mockResolvedValue(createdCategory);

        await expect(service.createCategory(createCategoryDTO))
        .rejects.toThrow(new ConflictException('Já existe uma categoria com este nome.'));
        expect(mockCategoryModel.findOne).toHaveBeenCalledWith({name: createCategoryDTO.name});
    });

    it('deve retornar uma categoria quando encontrada pelo ID.', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        const mockedCategory = {
            name: 'Categoria de Teste',
            toObject: () => ({
                name: 'Categoria de Teste'
            }),
        };

        mockCategoryModel.exec = jest.fn().mockResolvedValue(mockedCategory);

        const result = await service.findCategoryById(categoryId);
        const expectedCategory = mockedCategory.toObject();

        expect(result).toEqual({ category: expectedCategory });
    });

    it('deve lançar NotFoundException se a categoria não for encontrada.', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        mockCategoryModel.exec = jest.fn().mockResolvedValue(null);

        await expect(service.findCategoryById(categoryId))
        .rejects.toThrow(new NotFoundException('Categoria não encontrada.'));
    });
    
    it('deve atualizar os dados da categoria corretamente', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        const updateCategoryDTO: UpdateCategoryDTO = {
            name: 'Nome Atualizado',
        };

        const updatedCategory = {
            ...updateCategoryDTO,
            toObject: () => ({
                name: 'Nome Atualizado',
            }),
        };

        mockCategoryModel.exec =jest.fn().mockResolvedValue(updatedCategory);

        const result = await service.updateCategory(categoryId, updateCategoryDTO);

        const expectedCategory = updatedCategory.toObject();

        expect(result).toEqual({ updatedCategory : expectedCategory });
        expect(mockCategoryModel.findByIdAndUpdate)
        .toHaveBeenCalledWith(categoryId, updateCategoryDTO, { new: true });
    });

    it('deve lançar um NotFoundException se a categoria não for encontrada', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        const updateCategoryDTO: UpdateCategoryDTO = { name: 'Nome Atualizado' };

        mockCategoryModel.exec = jest.fn().mockResolvedValue(null);

        await expect(service.updateCategory(categoryId, updateCategoryDTO))
        .rejects.toThrow(new NotFoundException('Categoria não encontrada.'));
    });

    it('deve deletar uma categoria corretamente.', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        const mockedCategory = {
            name: 'Categoria Teste',
        };

        mockCategoryModel.exec = jest.fn().mockResolvedValue(mockedCategory);

        await service.deleteCategory(categoryId);

        expect(mockCategoryModel.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
    });

    it('deve lançar NotFoundException se a categoria não for encontrada.', async () => {
        const categoryId = '507f1f77bcf86cd799439011';

        mockCategoryModel.exec = jest.fn().mockResolvedValue(null);

        await expect(service.deleteCategory(categoryId))
        .rejects.toThrow(new NotFoundException('Categoria não encontrada.'));
    })
})