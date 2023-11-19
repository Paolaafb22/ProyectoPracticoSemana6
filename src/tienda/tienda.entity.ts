import { ProductoEntity } from 'src/producto/producto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TiendaEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
name: string;

@Column()
city: string;

@Column()
address: string;

@ManyToMany(() => ProductoEntity, producto => producto.tiendas)
@JoinTable()
productos: ProductoEntity[];
/**
 * lo que indica esta anotación, es que la clase TiendaEntity es la dueña de la asociación.
 *  Esto significa que una Tienda agregará a los productos y no al contrario.
 */
}
