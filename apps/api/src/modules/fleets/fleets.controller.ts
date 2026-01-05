import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { FleetsService } from './fleets.service'

@ApiTags('Fleets')
@Controller('fleets')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class FleetsController {
  constructor(private fleetsService: FleetsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current fleet details' })
  async getMyFleet(@Request() req: any) {
    return this.fleetsService.findById(req.user.fleetId)
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get fleet statistics' })
  async getFleetStats(@Request() req: any) {
    return this.fleetsService.getStats(req.user.fleetId)
  }
}
