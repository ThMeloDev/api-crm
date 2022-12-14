import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Colaborador } from './colaborador.entity';
import { Documento } from './documento.entity';
import { SetorEnvolvido } from './setorEnvolvido.entity';
import { SistemaEnvolvido } from './sistemaEnvolvido.entity';

export interface CrmProps {
  id: number;
  versao: number;
  nome: string;
  dataAbertura: Date;
  dataFechamento?: Date;
  necessidade: string;
  impacto: string;
  descricao: string;
  objetivo: string;
  justificativa: string;
  alternativas: string;
  dataLegal?: Date;
  impactoMudanca?: string;
  comportamentoOffline?: string;
  desenvolvimentoDependente?:string;
  colaboradorCriador: Colaborador;
  setoresEnvolvidos: SetorEnvolvido[];
  sistemasEnvolvidos?: SistemaEnvolvido[];
  documentos?: Documento[];
}

@Entity()
export class Crm implements CrmProps {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number;

  @PrimaryColumn({ type: 'int', name: 'versao', default: 1 })
  versao: number;

  @Column({ type: 'varchar', length: '30', name: 'nome' })
  nome: string;

  @Column({ type: 'timestamp', name: 'dataAbertura' })
  dataAbertura: Date;

  @Column({ type: 'timestamp', name: 'dataFechamento', nullable: true })
  dataFechamento: Date;

  @Column({ type: 'text', name: 'necessidade' })
  necessidade: string;

  @Column({ type: 'text', name: 'impacto' })
  impacto: string;

  @Column({ type: 'text', name: 'descricao' })
  descricao: string;

  @Column({ type: 'text', name: 'objetivo' })
  objetivo: string;

  @Column({ type: 'text', name: 'justificativa' })
  justificativa: string;

  @Column({ type: 'text', name: 'alternativas', nullable: true })
  alternativas: string;

  @Column({ type: 'date', name: 'datalegal', nullable: true })
  dataLegal: Date;

  @Column({ type: 'text', name: 'impactoMudanca', nullable: true })
  impactoMudanca: string;

  @Column({ type: 'text', name: 'comportamentoOffline', nullable: true })
  comportamentoOffline: string;
  
  @Column({type:'varchar',length:45,name: 'complexidade'})
  complexidade: string;

  @Column({type:'varchar',length:200,name:'desenvolvimentoDependente'})
  desenvolvimentoDependente: string;

  @ManyToOne(() => Colaborador, (colaborador) => colaborador.crms)
  @JoinColumn({
    name: 'colaborador_matricula_criador',
    referencedColumnName: 'matricula',
  })
  colaboradorCriador: Colaborador;

  @OneToMany(() => SetorEnvolvido, (setorEnvolvido) => setorEnvolvido.crm, {
    cascade: true,
  })
  setoresEnvolvidos: SetorEnvolvido[];

  @OneToMany(
    () => SistemaEnvolvido,
    (sistemaEnvolvido) => sistemaEnvolvido.crm,
    { cascade: true },
  )
  sistemasEnvolvidos: SistemaEnvolvido[];

  @OneToMany(() => Documento, (documento) => documento.crm,{
    cascade: true,
  })
  documentos: Documento[];

  setProps(props: CrmProps): Crm {
    Object.assign(this, props);
    return this;
  }
}
