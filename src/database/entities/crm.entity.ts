import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Crm {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @PrimaryColumn({ type: 'int', name: 'versao'})
  versao: number;

  @Column({ type: 'varchar', length: '30', name: 'nome' })
  nome: string;

  @Column({type:'timestamp', name:'dataabertura'})
  dataAbertura: Date

  @Column({type:'timestamp', name:'dataFechamento', nullable: true})
  dataFechamento: Date | null

  @Column({type:'text', name:'necessidade'})
  necessidade: string;

  @Column({type:'text', name:'impacto'})
  impacto: string;

  @Column({type:'text', name:'descricao'})
  descricao: string;

  @Column({type:'text', name:'objetivo'})
  objetivo: string;

  @Column({type:'text', name:'justificativa'})
  justificativa: string;

  @Column({type:'text', name:'alternativas', nullable:true})
  alternativas: string | null;

  @Column({type:'date', name:'datalegal', nullable:true})
  dataLegal: string | null;

  @Column({type:'text', name:'impactomudanca', nullable:true})
  impactoMudanca: string | null;

  @Column({type:'text', name:'comportamentooffline', nullable:true})
  comportamentoOffline: string | null;
  
  @Column({type:'text', name:'motivoatualizado', nullable:true})
  motivoAtualizacao: string | null;

  @Column({type:'varchar',length:10, name:'colaborador_matricula_criador'})
  colaboradorCriador: string;

  @Column({type:'varchar',length:45, name:'complexidade_nome', nullable:true})
  complexidade: string | null;
}
