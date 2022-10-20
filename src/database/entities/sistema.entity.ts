import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SistemaEnvolvido } from './sistemaEnvolvido.entity';

@Entity()
export class Sistema {
  @PrimaryColumn({ type: 'varchar', length: 30, name: 'nome' })
  nome: string;

  @Column({ type: 'boolean', name: 'ativo' })
  ativo: boolean;

  @OneToMany(()=> SistemaEnvolvido, (sistemaEnvolvido) => sistemaEnvolvido.sistema)
  sistemasEnvolvidos: SistemaEnvolvido[];
}
