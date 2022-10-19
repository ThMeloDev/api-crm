import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Setor {
  @PrimaryColumn({ type: 'varchar', length: 40, name: 'nome' })
  nome: string;
}
