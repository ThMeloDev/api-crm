import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Complexidade {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'nome' })
  nome: string;
}
