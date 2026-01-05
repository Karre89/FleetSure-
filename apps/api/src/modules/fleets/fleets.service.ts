import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class FleetsService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.fleet.findUnique({
      where: { id },
      include: {
        _count: {
          select: { vehicles: true, jobs: true, users: true },
        },
      },
    })
  }

  async getStats(fleetId: string) {
    const [totalJobs, completedJobs, activeJobs] = await Promise.all([
      this.prisma.job.count({ where: { fleetId } }),
      this.prisma.job.count({ where: { fleetId, status: 'COMPLETED' } }),
      this.prisma.job.count({
        where: {
          fleetId,
          status: { in: ['REQUESTED', 'ASSIGNED', 'ACCEPTED', 'EN_ROUTE', 'ON_SITE'] },
        },
      }),
    ])

    return {
      totalJobs,
      completedJobs,
      activeJobs,
      cancelledJobs: 0, // TODO: Calculate
      slaCompliancePercent: 95.0, // TODO: Calculate
    }
  }
}
