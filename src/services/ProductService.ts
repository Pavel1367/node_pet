// services/ProductService.ts
import Product, {IProduct} from '../models/Product';
import Category from '../models/Category';

interface ISearchOptions {
    query?: string;
    limit?: number;
    page?: number;
    categorySlug: string;
    minPrice: number;
    maxPrice: number;
}

interface MongoSearchQuery {
    $or?: Array<Record<string, any>>;
    categorySlug?: string;
    price?: {
        $gte?: number;
        $lte?: number;
    };
}

class ProductService {
    async create(productData: Omit<IProduct, 'productId' | 'createdAt' | 'updatedAt'>): Promise<IProduct> {
        const categoryExists = await Category.exists({slug: productData.categorySlug});
        if (!categoryExists) {
            throw new Error('Category not found');
        }

        return await Product.create({
            ...productData,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }

    async getAll(options: { limit?: number, skip?: number } = {}): Promise<IProduct[]> {
        const {limit = 10, skip = 0} = options;
        return Product.find()
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);
    }

    async getById(productId: string): Promise<IProduct | null> {
        return Product.findOne({productId});
    }

    async getByCategory(categorySlug: string, options: { limit?: number, skip?: number } = {}): Promise<IProduct[]> {
        const {limit = 10, skip = 0} = options;
        return Product.find({categorySlug})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);
    }


    async update(productId: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        if (productData.categorySlug) {
            const categoryExists = await Category.exists({slug: productData.categorySlug});
            if (!categoryExists) {
                throw new Error('Category not found');
            }
        }

        return Product.findOneAndUpdate(
            {productId},
            {...productData, updatedAt: Date.now()},
            {new: true}
        );
    }

    async delete(productId: string): Promise<boolean> {
        const result = await Product.deleteOne({productId});
        return result.deletedCount > 0;
    }


    async searchProducts(options: ISearchOptions): Promise<{
        products: IProduct[],
        pagination: { currentPage: number, totalPages: number, totalItems: number, limit: number }
    }> {
        const {
            query = '',
            categorySlug = null,
            minPrice = null,
            maxPrice = null,
            page = 1,
            limit = 10
        } = options;
        const searchQuery = {} as MongoSearchQuery;

        if (query) {
            searchQuery.$or = [
                {name: {$regex: query, $options: 'i'}},
                {description: {$regex: query, $options: 'i'}}
            ];
        }

        if (categorySlug) {
            searchQuery.categorySlug = categorySlug;
        }

        if (minPrice !== null || maxPrice !== null) {
            searchQuery.price = {};
            if (minPrice !== null) searchQuery.price.$gte = minPrice;
            if (maxPrice !== null) searchQuery.price.$lte = maxPrice;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(searchQuery)
            .sort({createdAt: -1})  // Сортировка от новых к старым
            .skip(skip)
            .limit(limit);

        const totalCount = await Product.countDocuments(searchQuery);

        return {
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                limit
            }
        };
    }
}

export default new ProductService();