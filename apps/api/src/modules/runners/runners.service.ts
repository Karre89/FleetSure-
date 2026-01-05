import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class RunnersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.runner.findUnique({
      where: { id },
    })
  }

  async getTasks(runnerId: string) {
    return this.prisma.runnerTask.findMany({
      where: { runnerId },
      orderBy: { assignedAt: 'desc' },
      include: { partDeliveries: true },
    })
  }

  async updateTaskStatus(taskId: string, status: string) {
    const updateData: any = { status }
    const now = new Date()

    if (status === 'ACCEPTED') updateData.acceptedAt = now
    if (status === 'PICKING_UP') updateData.pickupArrivedAt = now
    if (status === 'PICKED_UP') updateData.pickedUpAt = now
    if (status === 'IN_TRANSIT') updateData.deliveryStartedAt = now
    if (status === 'DELIVERED') updateData.deliveredAt = now

    return this.prisma.runnerTask.update({
      where: { id: taskId },
      data: updateData,
    })
  }

  async updateAvailability(id: string, isAvailable: boolean) {
    return this.prisma.runner.update({
      where: { id },
      data: { isAvailable, isOnline: isAvailable },
    })
  }
}
