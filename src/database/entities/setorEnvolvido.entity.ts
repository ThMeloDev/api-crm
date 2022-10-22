import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Crm } from './crm.entity';
import { Flag } from './flag.entity';
import { Setor } from './setor.entity';

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

  @ManyToOne(() => Flag, (flag) => flag.setoresEnvolvidos)
  @JoinColumn({name: 'flag_nome', referencedColumnName: 'nome'})
  flag: Flag;

  @ManyToOne(() => Crm, (crm) => crm.setoresEnvolvidos)
  @JoinColumn([
    {name: 'crm_id', referencedColumnName: 'id'},
    {name: 'crm_versao', referencedColumnName: 'versao'}
  ])
  crm: Crm

  @ManyToOne(() => Setor, (setor) => setor.setoresEnvolvidos)
  @JoinColumn([{name: 'setor_nome', referencedColumnName: 'nome'}])
  setor: Setor
}
