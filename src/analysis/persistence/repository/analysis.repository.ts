import { PrismaService } from '../../../prisma/prisma.service';
import { DefaultPrismaRepository } from '../../../prisma/default.prisma.repository';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysisRepository extends DefaultPrismaRepository {
  private readonly model: PrismaService['analysis'];
  constructor(prismaService: PrismaService) {
    super();
    this.model = prismaService.analysis;
  }
  // save = async (data: AnalysisModel) => {
  //   try {
  //     return this.model.create({ data });
  //   } catch (error) {
  //     this.handleAndThrowError(error);
  //   }
  // };
}
