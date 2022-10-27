import { Inject, Injectable } from '@nestjs/common';
import { Crm } from 'src/database/entities/crm.entity';
import { Documento } from 'src/database/entities/documento.entity';
import { FLAGS_SETORES_ENVOLVIDOS, SetorEnvolvido } from 'src/database/entities/setorEnvolvido.entity';
import { SistemaEnvolvido } from 'src/database/entities/sistemaEnvolvido.entity';
import { Repository } from 'typeorm';
import { DocumentoService } from './documento.service';
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
    @Inject('DOCUMENTO_REPOSITORY')
    private documentoReposity: Repository<Documento>,
    private documentoService: DocumentoService,
    private sistemaService : SistemaService,
    private setorService: SetorService
  ) {}

  async findOne(id: number, versao: number): Promise<Crm[]> {
    return await this.crmReposity.find({
      select:{
        id:true,
        versao:true,
        nome: true,
        necessidade: true,
        objetivo: true,
        descricao:true,
        dataAbertura: true,
        dataFechamento: true,
        dataLegal:true,
        impacto: true,
        impactoMudanca: true,
        justificativa: true,
        motivoAtualizacao: true,
        comportamentoOffline:true,
        colaboradorCriador:{
          matricula: true
        },setoresEnvolvidos:{
         nomeSetor:true,
         flag: true,
         justificativa: true,
         matriculaColaborador: true
        },
        sistemasEnvolvidos:{sistemaNome: true},
        alternativas: true,
      },
      where: {
        id: id,
        versao: versao,
      },
      relations: {
        colaboradorCriador: {setor: true},
        setoresEnvolvidos: true,
        sistemasEnvolvidos: true
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

  async maxId(): Promise<any> {
    return await this.crmReposity.query(
      'select id from crm where crm.id = (select max(crm2.id) from crm crm2);'
    )
  }

  async createCrm(data: any): Promise<any> {
    //console.log(`data: ${JSON.stringify(data)}`)
    try {
      if (data.id != null || data.id != undefined) {
        const newCrm = await this.maxVersion(data.id);
        data.versao = newCrm.versao + 1;
      }else{
        const crmWithMaxId = await this.maxId()
        data.id = crmWithMaxId[0].id + 1
        data.versao = 1
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
      
      for(const nomeSetorEnvolvido of data.setoresEnvolvidos){
        const setor = await this.setorService.findOne(nomeSetorEnvolvido)
        const setorEnvolvido = new SetorEnvolvido().setProps({
          crmId: crm.id,
          crmVersao: crm.versao,
          nomeSetor: setor.nome,
          crm: crm,
          flag: FLAGS_SETORES_ENVOLVIDOS.PENDENTE,
          setor: setor
        })
        crm.setoresEnvolvidos.push(setorEnvolvido)
        // await this.setorEnvolvidoReposity.save(setorEnvolvido)
      
       }
      for(const nomeSistemaEnvolvido of data.sistemasEnvolvidos){
        const sistema = await this.sistemaService.findOne(nomeSistemaEnvolvido)
        const sistemaEnvolvido = new SistemaEnvolvido().setProps({
          crmId: crm.id,
          crmVersao: crm.versao,
          sistemaNome: sistema.nome,
          crm: crm,
          sistema: sistema
        })
        crm.sistemasEnvolvidos.push(sistemaEnvolvido)
      }
      await this.crmReposity.save(crm)
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
