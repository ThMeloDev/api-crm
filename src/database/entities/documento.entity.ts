import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Crm } from './crm.entity';

export interface DocumentoProps{
  pathDocumento: string,
  crm_id: number,
  crm_versao: number
  crm: Crm
}

@Entity()
export class Documento {
  @PrimaryColumn({ type: 'varchar', length: 256, name: 'pathDocumento' })
  pathDocumento: string;

  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crm_id: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crm_versao: number;

  @ManyToOne(() => Crm, (crm) => crm.documentos)
  @JoinColumn([
    { name: 'crm_id', referencedColumnName: 'id' },
    { name: 'crm_versao', referencedColumnName: 'versao' },
  ])
  crm: Crm;

  setProps(props: DocumentoProps): Documento{
    Object.assign(this,props)
    return this
  }
}
