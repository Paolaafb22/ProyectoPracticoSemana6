import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import { TiendaProductService } from './tienda-producto.service';
import { TiendaProductoController } from './tienda-producto.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TiendaEntity, ProductoEntity]),
  ],
  providers: [TiendaProductService],
  controllers: [TiendaProductoController],
})
export class TiendaProductoModule {}
