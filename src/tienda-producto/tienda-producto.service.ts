import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { ProductoEntity } from 'src/producto/producto.entity';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class TiendaProductoService {
  constructor(
    @InjectRepository(TiendaEntity)
    private readonly TiendaRepository: Repository<TiendaEntity>,

    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,
  ) {}

  async addTiendaProduct(tiendaId: string, productoId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity =
      await this.TiendaRepository.findOne({
        where: { id: tiendaId },
        relations: ['productos'],
      });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    tienda.productos = [...tienda.productos, producto];
    return await this.TiendaRepository.save(tienda);
  }

  async findProductByTiendaIdproductoId(
    tiendaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tienda: TiendaEntity =
      await this.TiendaRepository.findOne({
        where: { id: tiendaId },
        relations: ['productos'],
      });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const tiendaProducto: ProductoEntity =
      await tienda.productos.find((producto) => producto.id === productoId);
    if (!tiendaProducto)
      throw new BusinessLogicException(
        'The product with the given id is not associated with the tienda',
        BusinessError.PRECONDITION_FAILED,
      );

    return tiendaProducto;
  }

  async findProductsByTiendaId(
    tiendaId: string,
  ): Promise<ProductoEntity[]> {
    const tienda: TiendaEntity =
      await this.TiendaRepository.findOne({
        where: { id: tiendaId },
        relations: ['productos'],
      });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return tienda.productos;
  }

  async associateProductsToTienda(
    tiendaId: string,
    productos: ProductoEntity[],
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity =
      await this.TiendaRepository.findOne({
        where: { id: tiendaId },
        relations: ['productos'],
      });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (const producto of productos) {
      const productFound: ProductoEntity = await this.productoRepository.findOne({
        where: { id: producto.id },
      });
      if (!productFound)
        throw new BusinessLogicException(
          'The product with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    tienda.productos = [...tienda.productos, ...productos];
    return await this.TiendaRepository.save(tienda);
  }

  async deleteProductByGastroCultureIdproductoId(
    tiendaId: string,
    productoId: string,
  ): Promise<TiendaEntity> {
    const tienda: TiendaEntity =
      await this.TiendaRepository.findOne({
        where: { id: tiendaId },
        relations: ['productos'],
      });
    if (!tienda)
      throw new BusinessLogicException(
        'The tienda with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const producto = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    const tiendaProducto: ProductoEntity =
      await tienda.productos.find((producto) => producto.id === productoId);
    if (!tiendaProducto)
      throw new BusinessLogicException(
        'The product with the given id is not associated with the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );

    tienda.productos = tienda.productos.filter(
      (producto) => producto.id !== productoId,
    );
    return await this.TiendaRepository.save(tienda);
  }
}
