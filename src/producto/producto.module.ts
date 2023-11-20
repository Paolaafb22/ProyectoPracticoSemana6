import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ProductoService } from './producto.service';

@Module({
  providers: [ProductoService]
})
export class ProductoModule {}
