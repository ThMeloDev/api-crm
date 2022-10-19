import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Documento {
  @PrimaryColumn({ type: 'varchar', length: 100, name: 'pathDocumento' })
  pathDocumento: string;

  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crm_id: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crm_versao: number;
}
