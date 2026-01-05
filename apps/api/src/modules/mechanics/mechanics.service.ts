import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class MechanicsService {
  constructor(private prisma: PrismaService) {}

  async findAvailable(latitude: number, longitude: number) {
    // Find available mechanics, ordered by distance
    return this.prisma.mechanic.findMany({
      where: {
        isActive: true,
        isApproved: true,
        isAvailable: true,
        isOnline: true,
      },
      orderBy: { averageRating: 'desc' },
      take: 10,
    })
  }

  async findById(id: string) {
    return this.prisma.mechanic.findUnique({
      where: { id },
      include: { certifications: true, serviceAreas: true },
    })
  }

  async getJobsForMechanic(mechanicId: string) {
    return this.prisma.job.findMany({
      where: { mechanicId },
      orderBy: { requestedAt: 'desc' },
      include: {
        vehicle: { select: { id: true, unitNumber: true, make: true, model: true } },
        fleet: { select: { id: true, name: true } },
      },
      take: 20,
    })
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    return this.prisma.mechanic.update({
      where: { id },
      data: {
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastLocationUpdate: new Date(),
      },
    })
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    return this.prisma.mechanic.update({
      where: { id },
      data: { isAvailable },
    })
  }
}
