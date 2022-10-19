import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Flag {
  @PrimaryColumn({ type: 'varchar', length: 15, name: 'nome' })
  nome: string;
}
