import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Colaborador } from './colaborador.entity';
import { Crm } from './crm.entity';
import { Setor } from './setor.entity';

export interface SetorEnvolvidoProps{

  crmId: number;
  crmVersao: number;
  nomeSetor: string;
  matriculaColaborador?: string;
  justificativa?: string;
  flag?: FLAGS_SETORES_ENVOLVIDOS;
  crm?: Crm
  setor?: Setor
}

export enum FLAGS_SETORES_ENVOLVIDOS{
  PENDENTE = 'pendente',
  REJEITADO = 'rejeitado',
  APROVADO = 'aprovado'
} 

@Entity()
export class SetorEnvolvido {
  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crmId: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crmVersao: number;
  
  @PrimaryColumn({ type: 'varchar', length: 40, name: 'setor_nome' })
  nomeSetor: string;

  @Column({ type: 'varchar', length: 10, name: 'colaborador_matricula', nullable:true})
  matriculaColaborador: string | null;

  @Column({ type: 'text', name: 'justificativa', nullable:true })
  justificativa: string | null;

  @Column({ type: 'enum', enum:FLAGS_SETORES_ENVOLVIDOS , name: 'flag_nome', nullable:true })
  flag: string;

  @ManyToOne(() => Crm, (crm) => crm.setoresEnvolvidos)
  @JoinColumn([
    {name: 'crm_id', referencedColumnName: 'id'},
    {name: 'crm_versao', referencedColumnName: 'versao'}
  ])
  crm: Crm

  @ManyToOne(() => Setor, (setor) => setor.setoresEnvolvidos)
  @JoinColumn([{name: 'setor_nome', referencedColumnName: 'nome'}])
  setor: Setor

  @ManyToOne(() => Colaborador, (colaborador) => colaborador.setoresEnvolvidos)
  @JoinColumn([{name: 'colaborador_matricula', referencedColumnName: 'matricula'}])
  colaborador: Colaborador

  setProps(props: SetorEnvolvidoProps):SetorEnvolvido{
    Object.assign(this,props)
    return this
  }
}
