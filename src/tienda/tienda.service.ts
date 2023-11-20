/* eslint-disable prettier/prettier */
import { Injectable,BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>/**nos permite acceder a la base de datos */
    ){}

    async findAll(): Promise<TiendaEntity[]> {
        return await this.tiendaRepository.find({ relations: ["productos"] });
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ["productos"] } );
        if (!tienda)
        throw new BusinessLogicException("The Tienda with the given id was not found", BusinessError.NOT_FOUND);
    
        return tienda;
    }
    
    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        if (!this.isValidCityCode(tienda.city)) {
        throw new BadRequestException('Invalid city code. It should be a three-character code (e.g., SMR, BOG, MED)');
        }
    
        return await this.tiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const persistedtienda: TiendaEntity = await this.tiendaRepository.findOne({ where: { id } });
        if (!persistedtienda) {
            throw new BusinessLogicException("The Tienda with the given id was not found", BusinessError.NOT_FOUND);
        }
    
        if (!this.isValidCityCode(tienda.city)) {
            throw new BadRequestException('Invalid city code. It should be a three-character code (e.g., SMR, BOG, MED)');
        }
    
        return await this.tiendaRepository.save({ ...persistedtienda, ...tienda });
    }


    async delete(id: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where:{id}});
        if (!tienda)
throw new BusinessLogicException("The Tienda with the given id was not found", BusinessError.NOT_FOUND);
    
        await this.tiendaRepository.remove(tienda);
    }

    private isValidCityCode(cityCode: string): boolean {
        // Verifica si el código de la ciudad tiene tres caracteres
        return /^[A-Za-z]{3}$/.test(cityCode);
    }
}
