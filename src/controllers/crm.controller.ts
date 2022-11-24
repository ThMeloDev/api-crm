import { Body, Controller, Get, Param, Post, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/config/multer';
import { Crm } from 'src/database/entities/crm.entity';
import { CrmService } from 'src/services/crm.service';



@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get()
  async findOne(@Query() params): Promise<Crm[]> {
    return await this.crmService.findOne(params.id,params.versao);
  }

  @Get('rejectedCrm')
  async listRejectedCrm(@Query() params): Promise<any>{
    //CRMs rejeitadas que o usuario criou
    const listCrmUserCreated = await this.crmService.listRejectedCrm1(params.matricula);
    //CRMs rejeitadas que o usuario nao criou
    const listCrmUserNotCreated = await this.crmService.listRejectedCrm2(params.matricula)
    //une as listas
    const list = listCrmUserCreated.concat(listCrmUserNotCreated)
    return list;
  }

  @Get('pendingCrm')
  async listPendingCrm(@Query() params): Promise<any>{
    //CRMs pendentes que o usuario nao criou e o setor do Usuario esta envolvido
    const listCrmUserNotCreatedAndSectorInvolved= await this.crmService.listPendingCrm1(params.matricula, params.setor)
    //CRMs pendentes que o usuario criou
    const listCrmUserCreated = await this.crmService.listPendingCrm2(params.matricula)
    //CRMs pendentes que o usuario nao criou nem o setor esta envolvido
    const listCrmUserNotCreatedAndNotInvolved = await this.crmService.listPendingCrm3(params.matricula, params.setor)
    //Une as listas
    const list = listCrmUserNotCreatedAndSectorInvolved.concat(listCrmUserCreated,listCrmUserNotCreatedAndNotInvolved)
    return list
  }

  @Get('approvedCrm')
  async listApprovedCrm(@Query() params): Promise<any>{
    //CRMs aprovadas que o usuario criou
    const listCrmUserCreated= await this.crmService.listApprovedCrm1(params.matricula)
    //CRMs pendentes que o usuario nao criou e o setor esta envolvido
    const listCrmUserNotCreatedAndSectorInvolved = await this.crmService.listApprovedCrm2(params.matricula)
    //CRMs pendentes que o usuario nao criou nem o setor esta envolvido
    const listCrmUserNotCreatedAndNotInvolved = await this.crmService.listApprovedCrm3(params.matricula)
    //Une as listas
    const list = listCrmUserCreated.concat(listCrmUserNotCreatedAndSectorInvolved,listCrmUserNotCreatedAndNotInvolved)
    return list
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('documentos',20, {storage:storage}))
  async createCrm(@Body() data, @UploadedFiles() files: Array<Express.Multer.File>): Promise<any>{
    return await this.crmService.createCrm(data,files);
  }

  
  @Post('updateCrm')
  @UseInterceptors(FilesInterceptor('documentos',20, {storage:storage}))
  async updateCrm(@Body() data, @UploadedFiles() files: Array<Express.Multer.File> ){   
    return await this.crmService.updateCrm(data,files);
  }

  @Post('reject')
  async rejectCrm(@Body() data): Promise<any>{
    return await this.crmService.rejectCrm(data);
  }

  @Post('approve')
  async approveCrm(@Body() data): Promise<any>{
    return await this.crmService.approveCrm(data);
  }

  @Get('maxVersion')
  async maxVersion(@Query() params): Promise<any>{
    return await this.crmService.maxVersion(params.id);
  } 

  @Get('allCrm')
  async getAllCrms(@Query() params): Promise<Crm[]>{
    return await this.crmService.getAllCrms(params.id);
  } 
 
}
