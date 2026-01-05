import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  private generateJobNumber(): string {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0')
    return `FS-${year}-${random}`
  }

  async findAll(fleetId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters
    const skip = (page - 1) * limit

    const where: any = { fleetId }
    if (status) {
      where.status = { in: status.split(',') }
    }

    const [data, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedAt: 'desc' },
        include: {
          vehicle: { select: { id: true, unitNumber: true, make: true, model: true } },
          mechanic: { select: { id: true, firstName: true, lastName: true, phone: true } },
        },
      }),
      this.prisma.job.count({ where }),
    ])

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  async findById(id: string) {
    return this.prisma.job.findUnique({
      where: { id },
      include: {
        vehicle: true,
        mechanic: true,
        fleet: { select: { id: true, name: true } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        parts: true,
        photos: true,
      },
    })
  }

  async create(fleetId: string, data: any) {
    const jobNumber = this.generateJobNumber()

    const job = await this.prisma.job.create({
      data: {
        jobNumber,
        fleetId,
        vehicleId: data.vehicleId,
        locationLatitude: data.location.latitude,
        locationLongitude: data.location.longitude,
        locationAddress: data.location.address,
        locationCity: data.location.city,
        locationState: data.location.state,
        locationNotes: data.location.notes,
        issueType: data.issueType,
        issueDescription: data.issueDescription,
        urgency: data.urgency,
        jobType: data.jobType || 'ROADSIDE',
        status: 'REQUESTED',
        statusHistory: {
          create: {
            toStatus: 'REQUESTED',
            changedByType: 'SYSTEM',
          },
        },
      },
    })

    // TODO: Trigger mechanic assignment

    return job
  }

  async updateStatus(id: string, status: string, userId: string, notes?: string) {
    const job = await this.prisma.job.findUnique({ where: { id } })
    if (!job) throw new Error('Job not found')

    const updateData: any = { status }

    // Set timestamps based on status
    const now = new Date()
    if (status === 'ASSIGNED') updateData.assignedAt = now
    if (status === 'ACCEPTED') updateData.acceptedAt = now
    if (status === 'EN_ROUTE') updateData.enRouteAt = now
    if (status === 'ON_SITE') updateData.arrivedAt = now
    if (status === 'COMPLETED') updateData.completedAt = now
    if (status === 'PAID') updateData.paidAt = now
    if (status === 'CANCELLED') {
      updateData.cancelledAt = now
      updateData.cancelReason = notes
    }

    return this.prisma.job.update({
      where: { id },
      data: {
        ...updateData,
        statusHistory: {
          create: {
            fromStatus: job.status,
            toStatus: status as any,
            changedBy: userId,
            changedByType: 'USER',
            reason: notes,
          },
        },
      },
    })
  }
}
