import { ManyToMany, JoinTable } from 'typeorm';
import { TiendaEntity } from 'src/tienda/tienda.entity';
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

@Column()
price: number;

@Column()
type: string;

@ManyToMany(() => TiendaEntity, tienda => tienda.productos)
    tiendas: TiendaEntity[];
}
