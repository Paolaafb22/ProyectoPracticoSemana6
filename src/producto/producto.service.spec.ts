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
  let productosList: ProductoEntity[];

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
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const Producto: ProductoEntity = await repository.save({
        name: faker.company.companyName(),
        price: 0,
        type: "No perecedero",
        tiendas: [],
      });
      productosList.push(Producto);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all Productos', async () => {
    const Productos: ProductoEntity[] = await service.findAll();
    expect(Productos).not.toBeNull();
    expect(Productos).toHaveLength(productosList.length);
  });

  it('findOne should return a Producto by id', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const Producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(Producto).not.toBeNull();
    expect(Producto.name).toEqual(storedProducto.name);
    expect(Producto.price).toEqual(storedProducto.price);
    expect(Producto.type).toEqual(storedProducto.type);
  });

  it('findOne should throw an exception for an invalid Producto', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The Producto with the given id was not found");
  });

  it('create should return a new Producto', async () => {
    const Producto: ProductoEntity = {
      id: "",
      name: faker.company.companyName(),
      price: 0,
      type: "No perecedero",
      tiendas: [],
    };

    const newProducto: ProductoEntity = await service.create(Producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: newProducto.id } });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.name).toEqual(newProducto.name);
    expect(storedProducto.price).toEqual(newProducto.price);
    expect(storedProducto.type).toEqual(newProducto.type);
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

  it('update should modify a Producto', async () => {
    const Producto: ProductoEntity = productosList[0];
    Producto.name = "New name";
    Producto.price = 0;
    Producto.type = "no";

    const updatedProducto: ProductoEntity = await service.update(Producto.id, Producto);
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { id: Producto.id } });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.name).toEqual(Producto.name);
    expect(storedProducto.price).toEqual(Producto.price);
    expect(storedProducto.type).toEqual(Producto.type);
  });

  it('update should throw an exception for an invalid Producto', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, name: "New name", price: 0, type: "Perecedero",
    };
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "The Producto with the given id was not found");
  });

  it('update should throw an exception for an invalid type from Producto', async () => {
    let producto: ProductoEntity = productosList[0];

    producto = {
      ...producto,
      name: "New name",
      price: 0,
      type: "Perecedro",
    };

    await expect(() => service.update(producto.id, producto))
      .rejects
      .toHaveProperty("message", "Invalid product type. It should be Perecedero, No perecedero");
  });

  it('delete should remove a Producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);

    const deletedProducto: ProductoEntity = await repository.findOne({ where: { id: producto.id } });
    expect(deletedProducto).toBeNull();
  });

  it('delete should throw an exception for an invalid Producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The Producto with the given id was not found");
  });
});
