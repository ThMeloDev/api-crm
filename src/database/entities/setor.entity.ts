import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Colaborador } from './colaborador.entity';
import { SetorEnvolvido } from './setorEnvolvido.entity';

@Entity()
export class Setor {
  @PrimaryColumn({ type: 'varchar', length: 40, name: 'nome' })
  nome: string;

  @OneToMany(() => Colaborador, (colaborador) => colaborador.setor)
  colaboradores: Colaborador[];

  @OneToMany(() => SetorEnvolvido, (setorEnvolvido) => setorEnvolvido.setor)
  setoresEnvolvidos: SetorEnvolvido[];
}
