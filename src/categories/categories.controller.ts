import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '@prisma/client';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { UpdateCategoryDTO } from './dto/update-category.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Lista todas as categorias (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Categorias listadas com sucesso.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    async findAllCategories() {
        return this.categoriesService.findAll();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Cria uma nova categoria (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos para criação da categoria.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiBody({ type: CreateCategoryDTO })
    async createCategory(@Body() createCategoryDTO: CreateCategoryDTO) {
        return this.categoriesService.createCategory(createCategoryDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Busca uma categoria pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Categoria encontrada.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID da categoria a ser buscada' })
    async findCategoryById(@Param('id') id: string) {
        return this.categoriesService.findCategoryById(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza uma categoria pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos para atualização.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID da categoria a ser atualizada' })
    @ApiBody({ type: UpdateCategoryDTO })
    async updateCategory(@Param('id') id: string, @Body() updateCategoryDTO: UpdateCategoryDTO) {
        return this.categoriesService.updateCategory(id, updateCategoryDTO);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Deleta uma categoria pelo ID (Acesso restrito a ADMIN)' })
    @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    @ApiResponse({ status: 403, description: 'Usuário não autorizado.' })
    @ApiParam({ name: 'id', description: 'ID da categoria a ser deletada' })
    async deleteCategory(@Param('id') id:string) {
        return this.categoriesService.deleteCategory(id);
    }
}
