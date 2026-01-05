import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const emailLower = dto.email.toLowerCase()

    // Try to find user in Fleet Users table
    const user = await this.prisma.user.findUnique({
      where: { email: emailLower },
      include: { fleet: true },
    })

    if (user) {
      const passwordValid = await bcrypt.compare(dto.password, user.passwordHash)
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials')
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is disabled')
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      })

      return this.generateTokens(user)
    }

    // Try to find user in Mechanic table
    const mechanic = await this.prisma.mechanic.findUnique({
      where: { email: emailLower },
    })

    if (mechanic) {
      const passwordValid = await bcrypt.compare(dto.password, mechanic.passwordHash)
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials')
      }

      return this.generateMechanicTokens(mechanic)
    }

    // Try to find user in Runner table
    const runner = await this.prisma.runner.findUnique({
      where: { email: emailLower },
    })

    if (runner) {
      const passwordValid = await bcrypt.compare(dto.password, runner.passwordHash)
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials')
      }

      return this.generateRunnerTokens(runner)
    }

    throw new UnauthorizedException('Invalid credentials')
  }

  async register(dto: RegisterDto) {
    const emailLower = dto.email.toLowerCase()
    const passwordHash = await bcrypt.hash(dto.password, 12)

    // Check if email exists in any table
    const existingUser = await this.prisma.user.findUnique({ where: { email: emailLower } })
    const existingMechanic = await this.prisma.mechanic.findUnique({ where: { email: emailLower } })
    const existingRunner = await this.prisma.runner.findUnique({ where: { email: emailLower } })

    if (existingUser || existingMechanic || existingRunner) {
      throw new ConflictException('Email already registered')
    }

    // Handle different registration types
    if (dto.role === 'fleet') {
      // Create fleet and user together
      const fleet = await this.prisma.fleet.create({
        data: {
          name: dto.fleetName || `${dto.firstName}'s Fleet`,
          address: dto.fleetAddress,
          billingEmail: emailLower,
          phone: dto.phone,
          users: {
            create: {
              email: emailLower,
              passwordHash,
              firstName: dto.firstName,
              lastName: dto.lastName,
              phone: dto.phone,
              role: 'FLEET_OWNER',
            },
          },
        },
        include: {
          users: true,
        },
      })

      const user = fleet.users[0]
      return this.generateTokens({ ...user, fleet, userType: 'fleet' })
    } else if (dto.role === 'mechanic') {
      // Create mechanic record (separate from User table)
      const mechanic = await this.prisma.mechanic.create({
        data: {
          email: emailLower,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          isAvailable: true,
        },
      })

      return this.generateMechanicTokens(mechanic)
    } else if (dto.role === 'runner') {
      // Create runner record (separate from User table)
      const runner = await this.prisma.runner.create({
        data: {
          email: emailLower,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          isAvailable: true,
        },
      })

      return this.generateRunnerTokens(runner)
    }

    throw new ConflictException('Invalid role')
  }

  async refreshToken(token: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    })

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const user = await this.prisma.user.findUnique({
      where: { id: storedToken.userId },
      include: { fleet: true },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or disabled')
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    })

    return this.generateTokens(user)
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    })

    return { message: 'Logged out successfully' }
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role || 'fleet',
      userType: 'fleet',
      fleetId: user.fleetId,
    }

    const accessToken = this.jwtService.sign(payload)

    // Create refresh token
    const refreshToken = uuidv4()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    })

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'fleet',
        fleetId: user.fleetId,
        fleetName: user.fleet?.name,
      },
    }
  }

  private async generateMechanicTokens(mechanic: any) {
    const payload = {
      sub: mechanic.id,
      email: mechanic.email,
      role: 'mechanic',
      userType: 'mechanic',
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = uuidv4() // Simple refresh token for MVP

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: mechanic.id,
        email: mechanic.email,
        firstName: mechanic.firstName,
        lastName: mechanic.lastName,
        role: 'mechanic',
      },
    }
  }

  private async generateRunnerTokens(runner: any) {
    const payload = {
      sub: runner.id,
      email: runner.email,
      role: 'runner',
      userType: 'runner',
    }

    const accessToken = this.jwtService.sign(payload)
    const refreshToken = uuidv4() // Simple refresh token for MVP

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: runner.id,
        email: runner.email,
        firstName: runner.firstName,
        lastName: runner.lastName,
        role: 'runner',
      },
    }
  }
}
