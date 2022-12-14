
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Crm } from './crm.entity';
import { Sistema } from './sistema.entity';

export interface SistemaEnvolvidoProps{
  nomeSistema:string,
  crmId: number,
  crmVersao: number,
  crm?: Crm,
  sistema?: Sistema
}

@Entity()
export class SistemaEnvolvido {
  @PrimaryColumn({ type: 'varchar', length: 30, name: 'sistema_nome' })
  nomeSistema: string;

  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crmId: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crmVersao: number;

  @ManyToOne(() => Crm, (crm) => crm.sistemasEnvolvidos)
  @JoinColumn([
    {name: 'crm_id', referencedColumnName: 'id'},
    {name: 'crm_versao', referencedColumnName: 'versao'}
  ])
  crm: Crm;

  @ManyToOne(() => Sistema, (sistema) => sistema.sistemasEnvolvidos)
  @JoinColumn({name: 'sistema_nome', referencedColumnName: 'nome'})
  sistema: Sistema;

  setProps(props: SistemaEnvolvidoProps): SistemaEnvolvido{
    Object.assign(this,props)
    return this
  }
}
