import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class SetoresEnvolvidos {
  @PrimaryColumn({ type: 'int4', name: 'crm_id' })
  crmId: number;

  @PrimaryColumn({ type: 'int4', name: 'crm_versao' })
  crmVersao: number;

  @PrimaryColumn({ type: 'varchar', length: 40, name: 'setor_nome' })
  setorNome: string;

  @Column({ type: 'varchar', length: 15, name: 'flag_nome', nullable:true })
  flagNome: string | null;

  @Column({ type: 'varchar', length: 10, name: 'colaborador_matricula', nullable:true})
  colaboradorMatricula: string | null;

  @Column({ type: 'text', name: 'justificativa', nullable:true })
  justificativa: string | null;
}
