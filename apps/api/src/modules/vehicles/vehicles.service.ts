import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAll(fleetId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: { fleetId, isActive: true },
        skip,
        take: limit,
        orderBy: { unitNumber: 'asc' },
      }),
      this.prisma.vehicle.count({ where: { fleetId, isActive: true } }),
    ])

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  async findById(id: string, fleetId: string) {
    return this.prisma.vehicle.findFirst({
      where: { id, fleetId },
    })
  }

  async create(fleetId: string, data: any) {
    return this.prisma.vehicle.create({
      data: { ...data, fleetId },
    })
  }
}
