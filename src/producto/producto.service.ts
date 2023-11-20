/* eslint-disable prettier/prettier */
import { Injectable,BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>/**nos permite acceder a la base de datos */
    ){}

    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find({ relations: ["tiendas"] });
    }

    async findOne(id: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["tiendas"] } );
        if (!producto)
        throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
    
        return producto;
    }
    
    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        if (!this.isValidProductType(producto.type)) {
        throw new BadRequestException('Invalid  product type. It should be Perecedero, No perecedero');
        }
    
        return await this.productoRepository.save(producto);
    }

    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const persistedproducto: ProductoEntity = await this.productoRepository.findOne({ where: { id } });
        if (!persistedproducto) {
            throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        if (!this.isValidProductType(producto.type)) {
            throw new BadRequestException('Invalid product type. It should be Perecedero, No perecedero');
        }
    
        return await this.productoRepository.save({ ...persistedproducto, ...producto });
    }


    async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{id}});
        if (!producto)
throw new BusinessLogicException("The producto with the given id was not found", BusinessError.NOT_FOUND);
    
        await this.productoRepository.remove(producto);
    }

    private isValidProductType(productType: string): boolean {
        // Normalizamos el formato convirtiendo a minúsculas y eliminando espacios al principio y al final
        const normalizedProductType = productType.trim().toLowerCase();
        
        // Definimos los tipos permitidos en minúsculas
        const allowedTypes = ['perecedero', 'no perecedero'];
    
        // Comparamos con los tipos permitidos
        return allowedTypes.includes(normalizedProductType);
    }
    
}
