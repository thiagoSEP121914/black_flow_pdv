import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ProductService, CreateProductDTO } from '../ProductService.js';
import { IProductRepository } from '../repositories/IProductRepository.js';
import { StoreService } from '../../Store/StoreService.js';
import { UserContext } from '../../../core/types/UserContext.js';
import { NotFoundError } from '../../../errors/NotFounError.js';
import { Product } from '@prisma/client';

// Mock types
type MockRepository = jest.Mocked<IProductRepository>;
type MockStoreService = jest.Mocked<StoreService>;

describe('ProductService', () => {
    let productService: ProductService;
    let mockRepository: MockRepository;
    let mockStoreService: MockStoreService;

    const mockCtx: UserContext = {
        userId: 'user-1',
        companyId: 'company-1',
        role: 'OWNER'
    };

    beforeEach(() => {
        // Create mock repository
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByCode: jest.fn(),
            findByCompanyId: jest.fn(),
            findByCategoryId: jest.fn(),
        } as unknown as MockRepository;

        // Create mock StoreService
        // We cast to any/unknown because we are mocking the instance manually or partially
        mockStoreService = {
            findStoreById: jest.fn(),
        } as unknown as MockStoreService;

        productService = new ProductService(mockRepository, mockStoreService);
    });

    it('should create a product successfully', async () => {
        const input: CreateProductDTO = {
            name: 'New Product',
            salePrice: 100,
            storeId: 'store-1',
        };

        const mockStore = { id: 'store-1', companyId: 'company-1' };
        const mockProduct = { ...input, id: 'prod-1', companyId: 'company-1' } as Product;

        mockStoreService.findStoreById.mockResolvedValue(mockStore as any);
        mockRepository.insert.mockResolvedValue(mockProduct);

        const result = await productService.save(mockCtx, input);

        expect(result).toEqual(mockProduct);
        expect(mockStoreService.findStoreById).toHaveBeenCalledWith(mockCtx, 'store-1');
        expect(mockRepository.insert).toHaveBeenCalledWith(expect.objectContaining({
            companyId: 'company-1',
            storeId: 'store-1',
        }));
    });

    it('should throw error if trying to create product in store from another company', async () => {
        const input: CreateProductDTO = {
            name: 'Hacker Product',
            salePrice: 50,
            storeId: 'store-another-company',
        };

        const mockStore = {
            id: 'store-another-company',
            companyId: 'company-2', // Different company
        };

        mockStoreService.findStoreById.mockResolvedValue(mockStore as any);

        await expect(productService.save(mockCtx, input))
            .rejects
            .toThrow(NotFoundError); // Service throws NotFoundError for security mismatch

        expect(mockRepository.insert).not.toHaveBeenCalled();
    });

    it('should throw error if store does not exist', async () => {
        const input: CreateProductDTO = {
            name: 'Ghost Product',
            salePrice: 50,
            storeId: 'store-ghost',
        };

        // Simulating StoreService throwing NotFound or returning null (depending on impl)
        // In current implementation, StoreService throws NotFoundError itself if not found.
        // But for this test let's say findStoreById returns valid store but we want to simulate the check inside ProductService if we mocked differently.
        // Actually, let's strictly follow ProductService logic:
        // ProductService calls storeService.findStoreById. If that throws, ProductService throws.
        // So let's mock storeService throwing.

        mockStoreService.findStoreById.mockRejectedValue(new NotFoundError('Store not found'));

        await expect(productService.save(mockCtx, input))
            .rejects
            .toThrow(NotFoundError);
    });
});
