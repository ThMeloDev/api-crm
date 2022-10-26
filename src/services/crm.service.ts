import { Inject, Injectable } from '@nestjs/common';
import { Crm } from 'src/database/entities/crm.entity';
import { FLAGS_SETORES_ENVOLVIDOS, SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { SistemaEnvolvido } from 'src/database/entities/sistemaEnvolvido.entity';
import { Repository } from 'typeorm';
import { SetorService } from './setor.service';
import { SistemaService } from './sistema.service';


@Injectable()
export class CrmService {
  constructor(
    @Inject('CRM_REPOSITORY')
    private crmReposity: Repository<Crm>,
    @Inject('SETORENVOLVIDO_REPOSITORY')
    private setorEnvolvidoReposity: Repository<SetorEnvolvido>,
    @Inject('SISTEMAENVOLVIDO_REPOSITORY')
    private sistemaEnvolvidoReposity: Repository<SistemaEnvolvido>,
    private sistemaService : SistemaService,
    private setorService: SetorService
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

  async maxIdWithVersion(): Promise<Crm> {
    return await this.crmReposity.query(
      'select id , versao from crm where crm.id = (select max(crm2.id) from crm crm2);'
    )
  }

  async createCrm(data: any): Promise<any> {
    try {
      if (data.id != null || data.id != undefined) {
        const newCrm = await this.maxVersion(data.id);
        data.versao = newCrm.versao + 1;
      }
      let crm = new Crm().setProps({
        id: data.id,
        versao: data.versao,
        alternativas: data.alternativas,
        colaboradorCriador: data.colaboradorCriador,
        comportamentoOffline: data.comportamentoOffline,
        dataAbertura: data.dataAbertura,
        dataLegal: data.dataLegal,
        descricao: data.descricao,
        impacto: data.impacto,
        justificativa: data.justificativa,
        necessidade: data.necessidade,
        nome: data.nome,
        objetivo: data.objetivo,
        setoresEnvolvidos: [],
        sistemasEnvolvidos: []
      })
      const c = await this.crmReposity.save(crm);

     for(const nomeSetorEnvolvido of data.setoresEnvolvidos){
       const setor = await this.setorService.findOne(nomeSetorEnvolvido)
       const setorEnvolvido = new SetorEnvolvido().setProps({
         crmId: c.id,
         crmVersao: c.versao,
         nomeSetor: setor.nome,
         flag: FLAGS_SETORES_ENVOLVIDOS.PENDENTE
       })
       const setorEnvolvidoResponse = await this.setorEnvolvidoReposity.save(setorEnvolvido)

       console.log(`setorEnvolvidoResponse: ${JSON.stringify(setorEnvolvidoResponse)}`)
       
      }

      for(const nomeSistemaEnvolvido of data.sistemasEnvolvidos){
        const sistema = await this.sistemaService.findOne(nomeSistemaEnvolvido)
        console.log(`sistema: ${JSON.stringify(sistema)}`)
        const sistemaEnvolvido = new SistemaEnvolvido().setProps({
          crmId: c.id,
          crmVersao: c.versao,
          sistemaNome: sistema.nome
        })
        await this.sistemaEnvolvidoReposity.save(sistemaEnvolvido);
      }

      return {message: 'CADASTRADA'}
    } catch (error) {
      return {message: 'ERROR'};
    }
  }



  //CRMs rejeitadas que o usuario criou
  async listRejectedCrm1(matricula: string): Promise<Crm[] | undefined> {
      return await this.crmReposity
      .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome,criador.nome || ' ' || criador.sobrenome AS criador, (select array_agg(se3.setor_nome || ' - ' || c.nome || ' ' || c.sobrenome ) as setores from setor_envolvido se3 join colaborador c on (se3.colaborador_matricula = c.matricula) where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'rejeitado') FROM setor_envolvido se JOIN crm ON (se.crm_id = crm.id AND se.crm_versao = crm.versao) JOIN colaborador criador ON (criador.matricula = crm.colaborador_matricula_criador) WHERE (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0 AND (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'rejeitado' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id)) >= 1 AND se.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND criador.matricula = '${matricula}' GROUP BY crm.id,criador.nome,criador.sobrenome,crm.versao order by crm.id;`)
  }

  //CRMs rejeitadas que o usuario nao criou
  async listRejectedCrm2(matricula: string): Promise<Crm[] | undefined> {
    return await this.crmReposity
      .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome,criador.nome || ' ' || criador.sobrenome AS criador, (select array_agg(se3.setor_nome || ' - ' || c.nome || ' ' || c.sobrenome ) as setores from setor_envolvido se3 join colaborador c on (se3.colaborador_matricula = c.matricula) where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'rejeitado') FROM setor_envolvido se JOIN crm ON (se.crm_id = crm.id AND se.crm_versao = crm.versao) JOIN colaborador criador ON (criador.matricula = crm.colaborador_matricula_criador) WHERE (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0 AND (SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'rejeitado' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id)) >= 1 AND se.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND criador.matricula != '${matricula}' GROUP BY crm.id,criador.nome,criador.sobrenome,crm.versao order by crm.id;`)
  }

  //CRMs pendentes que o usuario nao criou e o setor do Usuario esta envolvido
  async listPendingCrm1(matricula: string, setor:string): Promise<Crm[] | undefined>{
    return await this.crmReposity
        .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome,criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome) as setores from setor_envolvido se3 where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'pendente') FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula != '${matricula}' and exists (SELECT * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome = 'pendente' and se2.setor_nome = '${setor}') GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs pendentes que o usuario criou
  async listPendingCrm2(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome,criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome) as setores from setor_envolvido se3 where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'pendente') FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula = '${matricula}' GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs pendentes que o usuario nao criou nem o setor esta envolvido
  async listPendingCrm3(matricula: string, setor:string): Promise<Crm[] | undefined>{
    return await this.crmReposity
        .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome,criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome) as setores from setor_envolvido se3 where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'pendente') FROM setor_envolvido se JOIN colaborador c ON (se.setor_nome = c.setor_nome) JOIN crm ON (crm.id = se.crm_id AND crm.versao = se.crm_versao) JOIN colaborador criador ON (crm.colaborador_matricula_criador = criador.matricula) WHERE crm.versao = (SELECT MAX(crm2.versao) FROM crm AS crm2 WHERE crm2.id = crm.id GROUP BY crm2.id) AND ( ( ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE (se2.flag_nome IN ('pendente','rejeitado')) AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') = 0) AND ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome = 'TI') = 1) ) OR ((SELECT COUNT(*) FROM setor_envolvido se2 WHERE se2.flag_nome = 'pendente' AND se2.crm_id = se.crm_id AND se2.crm_versao = (SELECT MAX(crm.versao) FROM crm WHERE crm.id = se.crm_id GROUP BY crm.id) AND se2.setor_nome != 'TI') > 0) ) AND criador.matricula != '${matricula}' and not exists (SELECT * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome = 'pendente' and se2.setor_nome = '${setor}') GROUP BY crm.id,crm.versao,criador.nome,criador.sobrenome order by crm.id;`)
  }

  //CRMs aprovadas que o usuario criou
  async listApprovedCrm1(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome, criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome || ' - ' || c.nome || ' ' || c.sobrenome ) as setores from setor_envolvido se3 join colaborador c on (se3.colaborador_matricula = c.matricula) where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'aprovado') FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and criador.matricula = '1' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }

  //CRMs aprovadas que o usuario nao criou e esta envolvido
  async listApprovedCrm2(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome, criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome || ' - ' || c.nome || ' ' || c.sobrenome ) as setores from setor_envolvido se3 join colaborador c on (se3.colaborador_matricula = c.matricula) where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'aprovado') FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and exists (select * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.colaborador_matricula = '${matricula}') and criador.matricula = '${matricula}' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }

   //CRMs aprovadas que o usuario nao criou e nao esta envolvido  
  async listApprovedCrm3(matricula: string): Promise<Crm[] | undefined>{
    return await this.crmReposity
    .query(`SELECT crm.id AS id,crm.versao AS versao,crm.nome AS nome, criador.nome || ' ' || criador.sobrenome as criador, (select array_agg(se3.setor_nome || ' - ' || c.nome || ' ' || c.sobrenome ) as setores from setor_envolvido se3 join colaborador c on (se3.colaborador_matricula = c.matricula) where se3.crm_id = crm.id and se3.crm_versao = crm.versao and se3.flag_nome = 'aprovado') FROM crm join colaborador criador on (criador.matricula = crm.colaborador_matricula_criador) join setor_envolvido se on (crm.id = se.crm_id and crm.versao = se.crm_versao) where crm.versao = (SELECT MAX(crm2.versao) FROM crm crm2 WHERE crm2.id = crm.id GROUP BY crm.id) and not exists (select * from setor_envolvido se2  where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.flag_nome in('pendente','rejeitado')) and exists (select * from setor_envolvido se2 where se2.crm_id = crm.id and se2.crm_versao = crm.versao and se2.colaborador_matricula != '${matricula}') and criador.matricula != '${matricula}' group by crm.id, crm.versao, criador.nome, criador.sobrenome order by crm.id;`)
  }
}
