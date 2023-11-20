import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ProductoDTO } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

    async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  async create(@Body() productoDTO: ProductoDTO) {
    const producto = plainToInstance(ProductoEntity, productoDTO);
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  async update(
    @Param('productoId') productoId: string,
    @Body() productoDTO: ProductoDTO,
  ) {
    const producto = plainToInstance(ProductoEntity, productoDTO);
    return await this.productoService.update(productoId, producto);
  }

  
  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string) {
    return await this.productoService.delete(productoId);
  }
}
