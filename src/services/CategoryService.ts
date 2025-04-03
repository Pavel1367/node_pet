// services/CategoryService.ts
import Category, {ICategory} from '../models/Category';

class CategoryService {
    async create(categoryData: Omit<ICategory, 'categoryId' | 'createdAt' | 'updatedAt'>): Promise<ICategory> {
        const slug = categoryData.slug

        const existingCategory = await Category.findOne({slug});
        if (existingCategory) {
            throw new Error('Category with this slug already exists');
        }

        return await Category.create({
            ...categoryData,
            slug,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }

    async getAll(): Promise<ICategory[]> {
        return Category.find();
    }

    async getBySlug(slug: string): Promise<ICategory | null> {
        return Category.findOne({slug});
    }

    async update(slug: string, categoryData: Partial<ICategory>): Promise<ICategory | null> {
        if (categoryData.slug && categoryData.slug !== slug) {
            const existingCategory = await Category.findOne({slug: categoryData.slug});
            if (existingCategory) {
                throw new Error('Category with this slug already exists');
            }
        }

        return Category.findOneAndUpdate(
            {slug},
            {...categoryData, updatedAt: Date.now()},
            {new: true}
        );
    }

    async delete(slug: string): Promise<boolean> {
        const result = await Category.deleteOne({slug});
        return result.deletedCount > 0;
    }
}

export default new CategoryService();