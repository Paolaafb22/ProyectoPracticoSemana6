/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaEntity } from './Tienda.entity';
import { TiendaService } from './tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { faker } from '@faker-js/faker';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const Tienda: TiendaEntity = await repository.save({
        name: faker.company.companyName(), 
        address: faker.address.secondaryAddress(), 
        city:'NYK' //faker.address.city(), 
        })
        tiendasList.push(Tienda);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendasList.length);
  });

  it('findOne should return a Tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendasList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.name).toEqual(storedTienda.name)
    expect(tienda.address).toEqual(storedTienda.address)
    expect(tienda.city).toEqual(storedTienda.city)    
  });

  it('findOne should throw an exception for an invalid Tienda', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The Tienda with the given id was not found")
  });
  it('create should return a new Tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      name: faker.company.companyName(), 
      address: faker.address.secondaryAddress(), 
      city: "BOG", 
      productos: []
    }
  
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({where: {id: newTienda.id}})
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.name).toEqual(newTienda.name)
    expect(storedTienda.address).toEqual(newTienda.address)
    expect(storedTienda.city).toEqual(newTienda.city)
  });

  it('create should no return  a new Tienda', async () => {
    const tienda: TiendaEntity = {
      id: "",
      name: faker.company.companyName(), 
      address: faker.address.secondaryAddress(), 
      city: "BOGOTA", 
      productos: []
    }
  
    await expect(async () => await service.create(tienda))
      .rejects
      .toHaveProperty("message", "Invalid city code. It should be a three-character code (e.g., SMR, BOG, MED)");
  });
  
  

  it('update should modify a Tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    tienda.name = "New name";
    tienda.address = "New address";
    tienda.city = "CAL";
  
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
  
    const storedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.name).toEqual(tienda.name)
    expect(storedTienda.address).toEqual(tienda.address)
    expect(storedTienda.city).toEqual(tienda.city)
  });

  it('update should throw an exception for an invalid Tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
    tienda = {
      ...tienda, name: "New name", address: "New address", city : "New"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "The Tienda with the given id was not found")
    
  });

  it('update should throw an exception for an invalid city from Tienda', async () => {
    let tienda: TiendaEntity = tiendasList[0];
  
    tienda = {
      ...tienda, 
      name: "New name", 
      address: "New address", 
      city: "MEDELLIN",
    }
  
    await expect(() => service.update(tienda.id, tienda))
      .rejects
      .toHaveProperty("message", "Invalid city code. It should be a three-character code (e.g., SMR, BOG, MED)");
  });
  

  it('delete should remove a Tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
  
    const deletedTienda: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedTienda).toBeNull();
  });

  it('delete should throw an exception for an invalid Tienda', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await service.delete(tienda.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The Tienda with the given id was not found")
  });
  

});
