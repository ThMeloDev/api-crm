import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SistemaEnvolvido {
  @PrimaryColumn({ type: 'varchar', length: 30, name: 'sistema_nome' })
  sistemaNome: string;

  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crmId: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crmVersao: number;
}
