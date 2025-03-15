import { Test, TestingModule } from "@nestjs/testing";
import { CartService } from "./cart.service"
import { getModelToken } from "@nestjs/mongoose";
import { Cart } from "./schemas/cart.schema";
import { CartItem } from "./schemas/cart-item.schema";
import { Product } from "src/products/schemas/products.schema";
import { CreateCartDTO } from "./dto/create-cart.dto";
import { BadRequestException, ConflictException, NotFoundException } from "@nestjs/common";
import { AddItemToCartDTO } from "./dto/add-item-to-cart.dto";

describe('CartService', () => {
    let service: CartService;
    let mockCartModel: any;
    let mockCartItemModel: any;
    let mockProductModel: any;

    beforeEach(async () => {
        mockCartModel = {
            exec: jest.fn(),
            findOne: jest.fn().mockReturnThis(),
            findById: jest.fn().mockReturnThis(),
            findByIdAndUpdate: jest.fn().mockReturnThis(),
            findByIdAndDelete: jest.fn().mockReturnThis(),
            create: jest.fn(),
            populate: jest.fn(),
        };

        mockProductModel = {
            findById: jest.fn().mockReturnThis(),
            exec: jest.fn(),
        };

        mockCartItemModel = {
            findOne: jest.fn().mockReturnThis(),
            deleteOne: jest.fn(),
            deleteMany: jest.fn(),
            exec: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
        }

        jest.mock('src/utils/parse-id.util', () => ({
            parseId: jest.fn().mockReturnValue('507f1f77bcf86cd799439011'),
          }));

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CartService,
                {
                    provide: getModelToken(Cart.name),
                    useValue: mockCartModel,
                },
                {
                    provide: getModelToken(CartItem.name),
                    useValue: mockCartItemModel,
                },
                {
                    provide: getModelToken(Product.name),
                    useValue: mockProductModel,
                },
            ],
        }).compile();

        service = module.get<CartService>(CartService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve criar um carrinho para o usuário', async () => {
        const createCartDTO: CreateCartDTO = {
            userId: '507f1f77bcf86cd799439011',
        }

        const cart = {
            "userId": "507f1f77bcf86cd799439011",
            "total": 0,
            "items": [],
            "_id": "67d37a68609ad7ee6fd41a0b",
            "_v": 0,
            toObject: () => ({
                "userId": "507f1f77bcf86cd799439011",
                "total": 0,
                "items": [],
                "_id": "67d37a68609ad7ee6fd41a0b",
            }),
        };

        mockCartModel.create = jest.fn().mockResolvedValue(cart);

        const result = await service.createCart(createCartDTO);
        expect(result).toEqual({cart: cart.toObject()});
    });

    it('deve lançar BadRequestException se o userId não tiver sido passado', async () => {
        const createCartDTO: CreateCartDTO = {
            userId: '',
        }
        
        await expect(service.createCart(createCartDTO)).rejects.toThrow(new BadRequestException('O campo userID deve ser preenchido.'));
    });

    it('deve lançar ConflictException se o usuário já tiver um carrinho', async () => {
        const createCartDTO: CreateCartDTO = {
            userId: '507f1f77bcf86cd799439011',
        }

        const cart = {
            "userId": "507f1f77bcf86cd799439011",
            "total": 0,
            "items": [],
            "_id": "67d37a68609ad7ee6fd41a0b",
            "_v": 0,
            toObject: () => ({
                "userId": "507f1f77bcf86cd799439011",
                "total": 0,
                "items": [],
                "_id": "67d37a68609ad7ee6fd41a0b",
            }),
        };

        mockCartModel.exec = jest.fn().mockResolvedValue(cart);

        await expect(service.createCart(createCartDTO)).rejects.toThrow(new ConflictException('O usuário já tem um carrinho.'));
    });

    it('deve adicionar o item ao carrinho', async () => {
        const addItemToCartDTO: AddItemToCartDTO = {
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
        };
    
        const mockedProduct = {
            name: 'Produto Teste 1',
            price: 499.99,
            stock: '1',
            categoryId: '67c039fceae9597d6fa80d28',
            description: 'Teste 1',
            _v: 0,
            toObject: () => ({
                name: 'Produto Teste 1',
                price: 499.99,
                stock: '1',
                categoryId: '67c039fceae9597d6fa80d28',
                description: 'Teste 1',
            }),
        };
    
        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
        };
    
        const cartItem = {
            _id: '507f1f77bcf86cd799439011',
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
            subtotal: 499.99,
            toObject: () => ({
                productId: '507f1f77bcf86cd799439011',
                quantity: 1,
                subtotal: 499.99,
            }),
        };
    
        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart),
        });
    
        mockProductModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockedProduct),
        });
    
        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });
    
        mockCartItemModel.create = jest.fn().mockResolvedValue(cartItem);
    
        mockCartModel.updateOne = jest.fn().mockResolvedValue({});
    
        service.updateCartTotal = jest.fn().mockResolvedValue(undefined);
    
        const result = await service.addItemToCart('507f1f77bcf86cd799439011', addItemToCartDTO);
    
        expect(result).toEqual(cartItem.toObject());
        expect(mockCartModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(mockProductModel.findById).toHaveBeenCalledWith(addItemToCartDTO.productId);
        expect(mockCartItemModel.create).toHaveBeenCalled();
        expect(mockCartModel.updateOne).toHaveBeenCalled();
        expect(service.updateCartTotal).toHaveBeenCalledWith(cart._id.toString());
    });

    it('deve lançar NotFoundException quando o produto não for encontrado', async () => {
        const addItemToCartDTO: AddItemToCartDTO = {
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
        };

        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
        };

        const cartItem = {
            _id: '507f1f77bcf86cd799439011',
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
            subtotal: 499.99,
            toObject: () => ({
                productId: '507f1f77bcf86cd799439011',
                quantity: 1,
                subtotal: 499.99,
            }),
        };

        mockProductModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null), 
        });

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart)
        })

        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cartItem),
        })

        mockCartItemModel.save = jest.fn().mockResolvedValue(true);
    
        await expect(service.addItemToCart('507f1f77bcf86cd799439011', addItemToCartDTO))
            .rejects
            .toThrow(new NotFoundException('Produto não encontrado.'));
    });
    
    it('deve lançar NotFoundException quando o carrinho não for encontrado', async () => {
        const addItemToCartDTO: AddItemToCartDTO = {
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
        };
    
        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });
    
        await expect(service.addItemToCart('507f1f77bcf86cd799439011', addItemToCartDTO))
            .rejects
            .toThrow(new NotFoundException('Carrinho não encontrado.'));
        
        expect(mockCartModel.findById).toHaveBeenCalled();
    });
    
    it('deve atualizar o total do carrinho corretamente', async () => {
        const cartId = '507f1f77bcf86cd799439011'; 
    
        const cartItems = [
            { subtotal: 100.00 },
            { subtotal: 200.00 },
            { subtotal: 150.00 },
        ];
    
        const expectedTotal = 450.00;
    
        mockCartItemModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cartItems)
        });
    
        mockCartModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue({
                _id: cartId,
                total: expectedTotal,
                items: cartItems,
            }),
        })
    
        await service.updateCartTotal(cartId);
    
        expect(mockCartItemModel.find).toHaveBeenCalledWith({ cartId });
    
        expect(mockCartModel.findByIdAndUpdate).toHaveBeenCalledWith(cartId, { total: expectedTotal });
    });

    it('deve remover o item do carrinho se a quantidade for 1', async () => {
        const removeItemFromCartDTO = {
            productId: '507f1f77bcf86cd799439011',
        };
    
        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
            save: jest.fn(),
        };
    
        const cartItem = {
            _id: '507f1f77bcf86cd799439011',
            productId: '507f1f77bcf86cd799439011',
            quantity: 1,
            subtotal: 499.99,
            deleteOne: jest.fn().mockResolvedValue(true),
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(this),
            }),
        };
    
        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart),
        });
        
        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(cartItem),
            }),
        }); 
        
        mockCartItemModel.save = jest.fn().mockResolvedValue(cartItem);
    
        service.updateCartTotal = jest.fn().mockResolvedValue(undefined);
    
        await service.removeItemFromCart('507f1f77bcf86cd799439011', removeItemFromCartDTO);
    
        expect(cartItem.deleteOne).toHaveBeenCalled();
        expect(mockCartModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        expect(service.updateCartTotal).toHaveBeenCalled();
    });

    it('deve diminuir a quantidade do item no carrinho se a quantidade for maior que 1', async () => {
        const removeItemFromCartDTO = {
            productId: '507f1f77bcf86cd799439011',
        };

        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
        };

        const cartItem = {
            _id: '507f1f77bcf86cd799439011',
            productId: '507f1f77bcf86cd799439011',
            quantity: 2,
            subtotal: 999.98,
            save: jest.fn(),
        };

        const product = {
            _id: '507f1f77bcf86cd799439011',
            price: 499.99,
        };

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart)
        });

        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(cartItem),
            })
        });

        mockProductModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockReturnValue(product),
        });

        service.updateCartTotal = jest.fn().mockResolvedValue(undefined);

        await service.removeItemFromCart('507f1f77bcf86cd799439011', removeItemFromCartDTO);

        expect(cartItem.quantity).toBe(1);
        expect(cartItem.subtotal).toBeCloseTo(499.99, 2);
        expect(cartItem.save).toHaveBeenCalled();
        expect(service.updateCartTotal).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o carrinho não for encontrado', async () => {
        const removeItemFromCartDTO = {
            productId: '507f1f77bcf86cd799439011',
        };

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.removeItemFromCart('507f1f77bcf86cd799439011', removeItemFromCartDTO))
            .rejects
            .toThrow(new NotFoundException('Carrinho não encontrado.'));
    });

    it('deve lançar NotFoundException se o item não for encontrado no carrinho', async () => {
        const removeItemFromCartDTO = {
            productId: '507f1f77bcf86cd799439011',
        };

        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
        };

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart)
        });

        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            }),
        });

        await expect(service.removeItemFromCart('507f1f77bcf86cd799439011', removeItemFromCartDTO))
            .rejects
            .toThrow(new NotFoundException('Item não encontrado no carrinho.'));
    });

    it('deve lançar NotFoundException se o produto não for encontrado ao atualizar o subtotal', async () => {
        const removeItemFromCartDTO = {
            productId: '507f1f77bcf86cd79943901',
        };

        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [],
        };

        const cartItem = {
            _id: '507f1f77bcf86cd799439011',
            productId: '507f1f77bcf86cd799439011',
            quantity: 2,
            subtotal: 999.98,
        };

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart)
        });

        mockCartItemModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(cartItem),
            }),
        });

        mockProductModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        await expect(service.removeItemFromCart('507f1f77bcf86cd799439011', removeItemFromCartDTO))
            .rejects
            .toThrow(new NotFoundException('Produto não encontrado.'));
    });
    
    it('deve retornar o carrinho com os itens formatados corretamente', async () => {
        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 100,
            items: [
                {
                    _id: '507f1f77bcf86cd799439012',
                    productId: { _id: '507f1f77bcf86cd799439013', name: 'Product A', price: 50 },
                    quantity: 2,
                },
            ],
            save: jest.fn(),
        };
    
        mockCartModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(cart),
            }),
        });
    
        const result = await service.getCart('507f1f77bcf86cd799439011');
        
        expect(mockCartModel.findOne).toHaveBeenCalledWith({ userId: '507f1f77bcf86cd799439011' });
        expect(result).toEqual({
            id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            items: [
                {
                    productId: '507f1f77bcf86cd799439013',
                    productName: 'Product A',
                    price: 50,
                    quantity: 2,
                    subtotal: 100,
                },
            ],
            total: 100,
        });
    });

    it('deve retornar null se o carrinho não for encontrado', async () => {
        mockCartModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(null), 
            }),
        });
    
        const result = await service.getCart('507f1f77bcf86cd799439011');
        
        expect(result).toBeNull();
        expect(mockCartModel.findOne).toHaveBeenCalledWith({ userId: '507f1f77bcf86cd799439011' });
    });
        
    it('deve retornar um carrinho vazio se não houver itens', async () => {
        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 0,
            items: [],
            save: jest.fn(),
        };
    
        mockCartModel.findOne = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(cart),
            }),
        });
    
        const result = await service.getCart('507f1f77bcf86cd799439011');
        
        expect(result).toEqual({
            id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            items: [],
            total: 0,
        });
    });
    
    it('deve excluir o carrinho', async () => {
        const cartId = '507f1f77bcf86cd799439011'

        const cart = {
            _id: '507f1f77bcf86cd799439011',
            userId: '507f1f77bcf86cd799439011',
            total: 0,
            items: [],
        };

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(cart),
        });

        mockCartModel.findByIdAndDelete = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        mockCartItemModel.deleteMany = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        await service.deleteCart(cartId);

        expect(mockCartModel.findById).toHaveBeenCalledWith(cartId);
        expect(mockCartItemModel.deleteMany).toHaveBeenCalledWith({cartId: cart._id});
        expect(mockCartModel.findByIdAndDelete).toHaveBeenCalledWith(cartId);
    });

    it('deve lançar NotFoundException se o carrinho não for encontrado', async () => {
        const cartId = '507f1f77bcf86cd799439011';

        mockCartModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
        });

        expect(service.deleteCart(cartId)).rejects.toThrow(new NotFoundException('Carrinho não encontrado.'));
    })

});
