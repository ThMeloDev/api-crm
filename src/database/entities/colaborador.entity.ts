import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Crm } from './crm.entity';
import { Setor } from './setor.entity';
import { SetorEnvolvido } from './setorEnvolvido.entity';

@Entity()
export class Colaborador {
  @PrimaryColumn({ type: 'varchar', length: 10, name: 'matricula' })
  matricula: string;

  @Column({ type: 'char', length: 11, name: 'cpf' })
  cpf: string;

  @Column({ type: 'varchar', length: 20, name: 'nome' })
  nome: string;

  @Column({ type: 'varchar', length: 80, name: 'sobrenome' })
  sobrenome: string;

  @Column({ type: 'varchar', length: 40, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 11, name: 'telefone' })
  telefone: string;

  @Column({ type: 'varchar', length: 20, name: 'senha' })
  senha: string;

  @ManyToOne(() => Setor, (setor) => setor.colaboradores)
  @JoinColumn({ name: 'setor_nome', referencedColumnName: 'nome' })
  setor: Setor;

  @OneToMany(() => SetorEnvolvido, (setorEnvolvido) => setorEnvolvido.colaborador)
  setoresEnvolvidos: SetorEnvolvido[];

  @OneToMany(() => Crm, (crm) => crm.colaboradorCriador)
  crms: Crm[];
}
