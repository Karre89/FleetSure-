import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../../prisma/prisma.service'

interface JwtPayload {
  sub: string
  email: string
  role: string
  fleetId?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {
    const jwtSecret = process.env.JWT_SECRET || config.get<string>('JWT_SECRET')
    console.log('JwtStrategy init - JWT_SECRET exists:', !!jwtSecret, '- length:', jwtSecret?.length || 0)
    if (!jwtSecret) {
      console.error('JWT env vars found:', Object.keys(process.env).filter(k => k.toLowerCase().includes('jwt')))
      throw new Error('JWT_SECRET environment variable is required')
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        fleetId: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException()
    }

    return user
  }
}
