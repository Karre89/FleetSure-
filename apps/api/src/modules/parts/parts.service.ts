import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class PartsService {
  constructor(private prisma: PrismaService) {}

  async findByJobId(jobId: string) {
    return this.prisma.part.findMany({
      where: { jobId },
      include: { vendor: true, delivery: true },
    })
  }

  async requestPart(jobId: string, data: any) {
    return this.prisma.part.create({
      data: {
        jobId,
        name: data.name,
        partNumber: data.partNumber,
        description: data.description,
        quantity: data.quantity || 1,
        fulfillmentType: data.fulfillmentType || 'RUNNER_DELIVERY',
        status: 'REQUESTED',
      },
    })
  }

  async getVendors(state?: string) {
    return this.prisma.partVendor.findMany({
      where: {
        isActive: true,
        ...(state && { state }),
      },
      orderBy: { isPriority: 'desc' },
    })
  }
}
