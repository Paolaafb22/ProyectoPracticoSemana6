/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './Producto.entity';
import { ProductoService } from './Producto.service';

import { faker } from '@faker-js/faker';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();

    productoList = [];
    for (let i = 0; i < 5; i++) {
      const entity: ProductoEntity = await repository.save({
        name: faker.company.companyName(),
        price: 0,
        type: "No perecedero",
        tiendas: [],
      });
      productoList.push(entity);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Productos', async () => {
    const entity: ProductoEntity[] = await service.findAll();
    expect(entity).not.toBeNull();
    expect(entity).toHaveLength(productoList.length);
  });

  it('findOne should return a product by id', async () => {
    const entity: ProductoEntity = productoList[0];
    const found: ProductoEntity = await service.findOne(
      entity.id 
    );
    expect(found).not.toBeNull();
    expect(found.id).toEqual(entity.id);
    expect(found.name).toEqual(entity.name);
    expect(found.price).toEqual(entity.price);
    expect(found.type).toEqual(entity.type);
  });

  it('findOne should throw an exception for an invalid Producto id', async () => {
    await expect(() => service.findOne('invalid')).rejects.toHaveProperty(
      "message",
      "The Producto with the given id was not found");
  });

  it('create should return a new Producto', async () => {
    const producto: ProductoEntity = {
      id: '',
      name: faker.company.companyName(),
      price: 0,
      type: "No perecedero",
      tiendas: [],
    };

    const entity: ProductoEntity = await service.create(producto);
    expect(entity).not.toBeNull();
    expect(entity.id).toBeDefined();
    expect(entity).not.toBeNull();
    expect(entity.name).toEqual(producto.name);
    expect(entity.price).toEqual(producto.price);
    expect(entity.type).toEqual(producto.type);
  });

  it('create should throw an exception for an invalid type from Producto', async () => {
    const producto: ProductoEntity = {
      id: "",
      name: faker.company.companyName(),
      price: 0,
      type: "NO PERECEDEROS",
      tiendas: [],
    };

    await expect(async () => await service.create(producto))
      .rejects
      .toHaveProperty("message", "Invalid product type. It should be Perecedero, No perecedero");
  });

  it('update should modify an Producto', async () => {
    const entity: ProductoEntity = productoList[0];
    entity.name = "New name";
    entity.price = 0;
    entity.type = "No Perecedero";
    const updatedProducto: ProductoEntity = await service.update(
      entity.id,
      entity,
      );
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: entity.id } });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.name).toEqual(entity.name);
    expect(storedProducto.price).toEqual(entity.price);
    expect(storedProducto.type).toEqual(entity.type);
  });

  it('update should throw an exception for an invalid Producto id', async () => {
    let entity: ProductoEntity = productoList[0];
    entity = {
      ...entity, name: "New name", price: 0, type: "Perecedero",
    };
    await expect(() => service.update("0", entity)).rejects.toHaveProperty("message", "The Producto with the given id was not found");
  });

  it('update should throw an exception for an invalid type from Producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.type = 'InvalidType';
  
    await expect(() => service.update(producto.id, producto))
      .rejects
      .toHaveProperty(
        "message", 
        "Invalid product type. It should be Perecedero, No perecedero"
      );
  });
  
/*
  it('update should throw an exception for an invalid type from Producto', async () => {
    let entity: ProductoEntity = productoList[0];

    entity = {
      ...entity,
      name: "New name",
      price: 0,
      type: "Perecedro",
    };

    await expect(() => service.update('0', entity))
      .rejects
      .toHaveProperty("message"
      , "Invalid product type. It should be Perecedero, No perecedero");
  });*/

  it('delete should remove a Producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid Producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The Producto with the given id was not found");
  });
});
