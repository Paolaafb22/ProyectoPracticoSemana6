import {
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
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { TiendaProductoService } from './tienda-producto.service';
import { ProductoDTO } from 'src/producto/producto.dto';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from 'src/producto/producto.entity';



@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaProductoController {
  constructor(
    private readonly tiendaProductoService:TiendaProductoService,
  ) {}

  @Post(':tiendaId/productos/:productoId')
  async addProductTienda(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.tiendaProductoService.addTiendaProduct(
      tiendaId,
      productoId,
    );
  }

  
  @Get(':tiendaId/productos/:productoId')
  async findProductByTiendaIdproductoId(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.tiendaProductoService.findProductByTiendaIdproductoId(
      tiendaId,
      productoId,
    );
  }

  @Get(':tiendaId/productos')
  async findproductosByTiendaId(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaProductoService.findproductosByTiendaId(
      tiendaId,
    );
  }

  @Put(':tiendaId/productos')
  async associateproductosTienda(
    @Param('tiendaId') tiendaId: string,
    @Param('productos') productosDto: ProductoDTO[],
  ) {
    const productos = plainToInstance(ProductoEntity, productosDto);
    return await this.tiendaProductoService.associateproductosToTienda(
      tiendaId,
      productos,
    );
  }

  @Delete(':tiendaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductGastroCulture(
    @Param('tiendaId') tiendaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.tiendaProductoService.deleteProductByTiendaIdproductoId(
      tiendaId,
      productoId,
    );
  }
}
