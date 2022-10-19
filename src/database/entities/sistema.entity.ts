import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Sistema {
  @PrimaryColumn({ type: 'varchar', length: 30, name: 'nome' })
  nome: string;

  @Column({ type: 'boolean', name: 'ativo' })
  ativo: boolean;
}
