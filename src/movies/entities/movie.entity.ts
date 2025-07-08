import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peliculas')
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ type: 'int', default: 0 })
  anio: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  genero?: string;

  @Column({ type: 'float', default: 0 })
  calificacion: number;
}
