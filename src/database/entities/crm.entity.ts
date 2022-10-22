import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Colaborador } from './colaborador.entity';
import { Complexidade } from './complexidade.entity';
import { Documento } from './documento.entity';
import { SetorEnvolvido } from './setorEnvolvido.entity';
import { SistemaEnvolvido } from './sistemaEnvolvido.entity';

@Entity()
export class Crm{
  @PrimaryColumn({ type: 'int', name: 'id'})
  id: number;

  @PrimaryColumn({ type: 'int', name: 'versao'})
  versao: number ;

  @Column({ type: 'varchar', length: '30', name: 'nome' })
  nome: string;

  @Column({type:'timestamp', name:'dataabertura'})
  dataAbertura: Date

  @Column({type:'timestamp', name:'dataFechamento', nullable: true})
  dataFechamento: Date

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
  alternativas: string;

  @Column({type:'date', name:'datalegal', nullable:true})
  dataLegal: string;

  @Column({type:'text', name:'impactomudanca', nullable:true})
  impactoMudanca: string;

  @Column({type:'text', name:'comportamentooffline', nullable:true})
  comportamentoOffline: string;
  
  @Column({type:'text', name:'motivoatualizado', nullable:true})
  motivoAtualizacao: string;

  @ManyToOne(() => Colaborador,(colaborador) => colaborador.crms)
  @JoinColumn({name:'colaborador_matricula_criador', referencedColumnName:'matricula'})
  colaboradorCriador: Colaborador;

  @ManyToOne(() => Complexidade,(complexidade) => complexidade.crms)
  @JoinColumn({name:'complexidade_nome', referencedColumnName:'nome'})
  complexidade: Complexidade;

  @OneToMany(() => SetorEnvolvido, (setorEnvolvido) => setorEnvolvido.crm)
  setoresEnvolvidos: SetorEnvolvido[];

  @OneToMany(()=> SistemaEnvolvido, (sistemaEnvolvido) => sistemaEnvolvido.crm)
  sistemasEnvolvidos: SistemaEnvolvido[];

  @OneToMany(() => Documento, (documento) => documento.crm)
  documentos: Documento[];
}
