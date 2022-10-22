import { Inject, Injectable } from '@nestjs/common';
import { Crm } from 'src/database/entities/crm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrmService {
  constructor(
    @Inject('CRM_REPOSITORY')
    private crmReposity: Repository<Crm>,
  ) {}

  async findOne(id: number, versao: number): Promise<Crm[]> {
    return await this.crmReposity.find({
      where: {
        id: id,
        versao: versao,
      },
      relations: {
        complexidade: true,
        colaboradorCriador: { setor: true },
        setoresEnvolvidos: true,
        sistemasEnvolvidos: true,
        documentos: true,
      },
    });
  }
  
  async maxVersion(crmId): Promise<Crm> {
    return await this.crmReposity
      .createQueryBuilder('crm')
      .select('MAX(crm.versao) AS versao')
      .where('crm.id = :id', { id: crmId })
      .getRawOne();
  }

  async createCrm(data: any): Promise<any> {
    try {
      let crm = new Crm();
      crm.id = data.id;
      if (crm.id != null || crm.id != undefined) {
        const newCrm = await this.maxVersion(crm.id);
        console.log(newCrm);
        crm.versao = newCrm.versao + 1;
      }
      crm.nome = data.nome;
      crm.necessidade = data.necessidade;
      crm.impacto = data.impacto;
      crm.descricao = data.descricao;
      crm.objetivo = data.objetivo;
      crm.justificativa = data.justificativa;
      crm.alternativas = data.alternativas;
      crm.dataLegal = data.dataLegal;
      crm.comportamentoOffline = data.comportamentoOffline;
      crm.colaboradorCriador = data.colaboradorCriador;
      await this.crmReposity.save(crm);
      return {
        message: 'Crm cadastrada com sucesso',
      };
    } catch (error) {
      return error;
    }
  }

  

  async quantPendentes(crmId, crmVersion): Promise<Crm> {
    return await this.crmReposity
      .createQueryBuilder('crm')
      .select('count(*) as pendentes')
      .leftJoinAndSelect('crm.setoresEnvolvidos', 'setoresEnvolvidos')
      .where('crm.versao = :versao', { versao: crmVersion })
      .andWhere('setoresEnvolvidos.flag = pendente')
      .andWhere('crm.id = :id', { id: crmId })
      .getRawOne();
  }

  //CRMs rejeitadas que o usuario criou
  async listRejectedCrm1(matricula: string): Promise<Crm[] | undefined> {
      return await this.crmReposity
      .query(`SELECT crm.id AS id,crm.versao AS versao,criador.nome || ' ' || criador.sobrenome AS criador FROM setor_envolvido se JOIN crm ON (se.crm_id = crm.id AND se.crm_versao = crm.versao) JOIN colaborador criador ON (criador.matricula = crm.colaborador_matricula_criador) WHERE (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0 AND (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'rejeitado' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id)) >= 1 AND se.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND criador.matricula = '${matricula}' GROUP BY crm.id,criador.nome,criador.sobrenome,crm.versao order by crm.id;`)
  }

  //CRMs rejeitadas que o usuario nao criou
  async listRejectedCrm2(matricula: string): Promise<Crm[] | undefined> {
    return await this.crmReposity
      .query(`SELECT crm.id AS id,crm.versao AS versao,criador.nome || ' ' || criador.sobrenome AS criador FROM setor_envolvido se JOIN crm ON (se.crm_id = crm.id AND se.crm_versao = crm.versao) JOIN colaborador criador ON (criador.matricula = crm.colaborador_matricula_criador) WHERE (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0 AND (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'rejeitado' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id)) >= 1 AND se.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND criador.matricula != '${matricula}' GROUP BY crm.id,criador.nome,criador.sobrenome,crm.versao order by crm.id;`)
  }

  //CRMs pendentes que o usuario nao criou e o setor do Usuario esta envolvido
  async listPendingCrm1(matricula: string, setor:string): Promise<Crm[] | undefined>{
    return await this.crmReposity
        .query(`SELECT crm.id,crm.versao,criador.nome || ' ' || criador.sobrenome as criador FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula != '${matricula}' and exists (SELECT * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome = 'pendente' and se2.setor_nome = '${setor}') GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs pendentes que o usuario criou
  async listPendingCrm2(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id,crm.versao,criador.nome || ' ' || criador.sobrenome as criador FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula = '${matricula}' GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs pendentes que o usuario nao criou nem o setor esta envolvido
  async listPendingCrm3(matricula: string, setor:string): Promise<Crm[] | undefined>{
    return await this.crmReposity
        .query(`SELECT crm.id,crm.versao,criador.nome || ' ' || criador.sobrenome as criador FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula != '${matricula}' and not exists (SELECT * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome = 'pendente' and se2.setor_nome = '${setor}') GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs aprovadas que o usuario criou
  async listApprovedCrm1(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id as id, crm.versao as versao, criador.nome || ' ' || criador.sobrenome as criador FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and criador.matricula = '1' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }

  //CRMs aprovadas que o usuario nao criou e esta envolvido
  async listApprovedCrm2(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id as id, crm.versao as versao, criador.nome || ' ' || criador.sobrenome as criador FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and exists (select * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.colaborador_matricula = '${matricula}') and criador.matricula = '${matricula}' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }

   //CRMs aprovadas que o usuario nao criou e nao esta envolvido  
  async listApprovedCrm3(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id as id, crm.versao as versao, criador.nome || ' ' || criador.sobrenome as criador FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and exists (select * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.colaborador_matricula != '${matricula}') and criador.matricula != '${matricula}' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }
}
