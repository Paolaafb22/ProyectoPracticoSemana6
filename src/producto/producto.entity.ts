import { ManyToMany, JoinTable } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
/**
 * Un producto puede pertenecer a muchas tiendas, y a una tienda pueden pertenecer muchos productos.
 */
@Entity()
export class ProductoEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
name: string;
@Column({ default: 13, nullable: true })
price: number;

//@Column()
@Column({ default: "Pertenece", nullable: true })
type: string;

@ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    tiendas: TiendaEntity[];
}
