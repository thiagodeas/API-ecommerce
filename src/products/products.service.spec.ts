import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service"
import { getModelToken } from "@nestjs/mongoose";
import { Product } from "./schemas/products.schema";
import { Category } from "src/categories/schemas/categories.schema";
import { CreateProductDTO } from "./dto/create-product.dto";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { UpdateProductDTO } from "./dto/update-product.dto";

describe('ProductsService', () => {
    let service: ProductsService;
    let mockProductModel: any;
    let mockCategoryModel: any;

    beforeEach(async () => {
        mockProductModel = {
            findByIdAndUpdate: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            save: jest.fn()
        };

        mockCategoryModel = {
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
        };

        jest.mock('src/utils/parse-id.util', () => ({
            parseId: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
          }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductsService,
                {
                    provide: getModelToken(Product.name),
                    useValue: mockProductModel,
                },
                {
                    provide: getModelToken(Category.name),
                    useValue: mockCategoryModel,
                },
            ],
        }).compile();

        service = module.get<ProductsService>(ProductsService);
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('dever retornar todos os produtos', async () => {
        const mockProducts = [
            { name: 'Produto Teste 1', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 1', _v: 0,
            toObject: () => ({
                name: 'Produto Teste 1', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 1', 
            })},
            { name: 'Produto Teste 2', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 2', _v: 0,
            toObject: () => ({
                name: 'Produto Teste 2', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 2', 
            })},
        ];

        mockProductModel.exec.mockResolvedValue(mockProducts);

        const result = await service.findAll();

        expect(result).toEqual({
            products: [
            { name: 'Produto Teste 1', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 1' },
            { name: 'Produto Teste 2', price: '499.99', stock: '1', categoryId: '67c039fceae9597d6fa80d28', description: 'Teste 2' },
        ],
    });

    expect(mockProductModel.find).toHaveBeenCalled();
    expect(mockProductModel.exec).toHaveBeenCalled();
    });

    it('deve criar um produto corretamente', async () => {
        const createProductDTO: CreateProductDTO = {
            name: 'Produto Teste',
            price: 499.99,
            stock: 1,
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste'
        };

        const mockedCategory = {
            id: '67c039fceae9597d6fa80d28'
        }

        const createdProduct = {
            ...createProductDTO,
            toObject: jest.fn().mockReturnValue({
              name: createProductDTO.name,
              price: createProductDTO.price,
              stock: createProductDTO.stock,
              description: createProductDTO.description,
              categoryId: '67c039fceae9597d6fa80d28',
            }),
          };

        mockProductModel.create = jest.fn().mockResolvedValue(createdProduct);
        
        mockCategoryModel.findById = jest.fn().mockResolvedValue(mockedCategory);
        mockCategoryModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnThis(),
        });

        const result = await service.createProduct(createProductDTO);

        expect(mockProductModel.create).toHaveBeenCalledWith(createProductDTO);
        expect(result).toEqual({
            product: {
                name: 'Produto Teste',
                price: 499.99,
                stock: 1,
                categoryId: '67c039fceae9597d6fa80d28',
                description: 'Teste'
            }
        });
    });

    it('deve lançar ConflictException se já existir um produto com o mesmo nome.', async () => {
        const createProductDTO: CreateProductDTO = {
            name: 'Produto Teste',
            price: 499.99,
            stock: 1,
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste'
        };

        mockProductModel.findOne = jest.fn().mockResolvedValue(createProductDTO);       
        
        await expect(service.createProduct(createProductDTO)).rejects.toThrow(new ConflictException('Já existe um produto com este nome.'));
        expect(mockProductModel.findOne).toHaveBeenCalled();
    })

    it('deve lançar NotFoundException se a categoria não for encontrada.', async () => {
        const createProductDTO: CreateProductDTO = {
            name: 'Produto Teste',
            price: 499.99,
            stock: 1,
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste'
        };

        mockCategoryModel.findById = jest.fn().mockResolvedValue(null);

        await expect(service.createProduct(createProductDTO)).rejects.toThrow(new NotFoundException('Categoria não encontrada.'));
        expect(mockCategoryModel.findById).toHaveBeenCalled();
    })

    it('deve retornar um produto quando encontrado pelo ID', async () => {
        const mockProduct = {
            name: 'Produto Teste',
            price: 499.99,
            stock: 1,
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste',
            toObject: () => ({
                name: 'Produto Teste',
                price: 499.99,
                stock: 1,
                categoryId: '67c039fceae9597d6fa80d28',
                description: 'Teste',
            }),
        };

        const productId = '507f1f77bcf86cd799439011';

        mockProductModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockProduct),
        });

        const result = await service.findProductById(productId);

        expect(result).toEqual({
            product:{
                name: 'Produto Teste',
                price: 499.99,
                stock: 1,
                categoryId: '67c039fceae9597d6fa80d28',
                description: 'Teste'
            }
        });
        expect(mockProductModel.findById).toHaveBeenCalledWith(productId);
    })

    it('deve lançar NotFoundException se o produto não for encontrado.', async () => {
        const nonExistingUserId = '507f1f77bcf86cd799439011';
    
        mockProductModel.findById = jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        });
    
        await expect(service.findProductById(nonExistingUserId)).rejects.toThrow(new NotFoundException('Produto não encontrado.'));
      });
    
      it('deve lançar BadRequestException se o ID fornecido não for válido.', async () => {
        const invalidUserId  = 'invalid-user-id';
    
        await expect(service.findProductById(invalidUserId)).rejects.toThrow(new BadRequestException('O ID fornecido não é válido.'));
      });

      it('deve retornar os produtos de uma categoria pelo ID', async () => {
        const categoryId = '67c039fceae9597d6fa80d28';

        const mockedProducts = [
                {
                    name: 'Produto Teste 1',
                    price: 499.99,
                    stock: 1,
                    categoryId: '67c039fceae9597d6fa80d28',
                    description: 'Teste 1',
                    toObject: () => ({
                        name: 'Produto Teste 1',
                        price: 499.99,
                        stock: 1,
                        categoryId: '67c039fceae9597d6fa80d28',
                        description: 'Teste 1',
                    }),
                },
                {
                    name: 'Produto Teste 2',
                    price: 499.99,
                    stock: 1,
                    categoryId: '67c039fceae9597d6fa80d28',
                    description: 'Teste 2',
                    toObject: () => ({
                        name: 'Produto Teste 2',
                        price: 499.99,
                        stock: 1,
                        categoryId: '67c039fceae9597d6fa80d28',
                        description: 'Teste 2',
                    }),
                },
            ];

        mockProductModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockedProducts),
        });

        const result = await service.findProductsByCategory(categoryId);

        const expectedProducts = mockedProducts.map(product => product.toObject());

        expect(mockProductModel.find().exec).toHaveBeenCalled();
        expect(mockProductModel.find).toHaveBeenCalledWith({ categoryId: categoryId});
        expect(result).toEqual({ products: expectedProducts});
      });
    
      it('deve retornar uma lista vazia se não houver produtos na categoria', async () => {
        const categoryId = '67c039fceae9597d6fa80d28';

        mockProductModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([]),
        });

        const result = await service.findProductsByCategory(categoryId)
        
        expect(result).toEqual({ products: [] });
        expect(mockProductModel.find).toHaveBeenCalledWith({categoryId});
      });

      it('deve atualizar os dados do produto corretamente', async () => {
        const productId = '507f1f77bcf86cd799439011';

        const updateProductDTO: UpdateProductDTO = {
            name: 'Produto Atualizado',
            description: 'Produto Atualizado',
            price: 150,
        };

        const updatedProduct = {
            ...updateProductDTO,
            toObject: () => ({
                name: 'Produto Atualizado',
                description: 'Produto Atualizado',
                price: 150,
            }),
        };

        mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedProduct)
        })

        const result = await service.updateProduct(productId, updateProductDTO);

        expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(productId, updateProductDTO, { new: true });
        expect(result).toEqual({
            updatedProduct: updatedProduct.toObject(),
        });
      });

      it('deve lançar NotFoundException quando o produto não for encontrado', async () => {
        const productId = '507f1f77bcf86cd799439011';

        const updateProductDTO: UpdateProductDTO = {
            name: 'Produto Atualizado',
            description: 'Produto Atualizado',
            price: 150,
        };

        mockProductModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        expect(service.updateProduct(productId, updateProductDTO)).rejects.toThrow(new NotFoundException('Produto não encontrado.'));
      });

      it('deve deletar um produto corretamente', async () => {
        const productId = '507f1f77bcf86cd799439011';

        const product = {
            name: 'Produto Teste 1',
            price: 499.99,
            stock: 1,
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste 1',
        };

        mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(product),
        });

        await service.deleteProduct(productId);

        expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(productId);
      });

      it('deve lançar NotFoundException se o produto não for encontrado.', async () => {
        const productId = '507f1f77bcf86cd799439011';

        mockProductModel.findByIdAndDelete = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        expect(service.deleteProduct(productId)).rejects.toThrow(new NotFoundException('Produto não encontrado.'));
      });
});