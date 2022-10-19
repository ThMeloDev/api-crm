import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Colaborador {
  @PrimaryColumn({ type: 'varchar', length: 10, name: 'matricula' })
  matricula: string;

  @Column({ type: 'char', length: 11, name: 'cpf' })
  cpf: string;

  @Column({ type: 'varchar', length: 20, name: 'nome' })
  nome: string;

  @Column({ type: 'varchar', length: 80, name: 'sobrenome' })
  sobrenome: string;

  @Column({ type: 'varchar', length: 40, name: 'email' })
  email: string;

  @Column({ type: 'varchar', length: 11, name: 'telefone' })
  telefone: string;

  @Column({ type: 'varchar', length: 20, name: 'senha' })
  senha: string;

  @Column({ type: 'varchar', length: 40, name: 'setor_nome' })
  nomeDoSetor: string;
}
