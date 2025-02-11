import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    async findAllCategories() {
        return this.categoriesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.createCategory(createCategoryDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    async findCategoryById(@Param('id') id: string) {
        return this.categoriesService.findCategoryById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDTO: UpdateCategoryDTO) {
        return this.categoriesService.updateCategory(id, updateCategoryDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    async deleteCategory(@Param('id') id:string) {
        return this.categoriesService.deleteCategory(id);
    }
}
