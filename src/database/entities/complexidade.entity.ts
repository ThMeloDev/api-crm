import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Crm } from './crm.entity';

@Entity()
export class Complexidade {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'nome' })
  nome: string;

  @OneToMany(() => Crm, (crm) => crm.complexidade)
  crms: Crm[];
}
