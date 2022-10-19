import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { SetorEnvolvido} from './setorEnvolvido.entity';

@Entity()
export class Flag {
  @PrimaryColumn({ type: 'varchar', length: 15, name: 'nome' })
  nome: string;

  @OneToMany(() => SetorEnvolvido, (setorEnvolvido) => setorEnvolvido.flag)
  setoresEnvolvidos: SetorEnvolvido[];
}
