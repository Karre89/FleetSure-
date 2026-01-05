import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { MechanicsService } from './mechanics.service'

@ApiTags('Mechanics')
@Controller('mechanics')
export class MechanicsController {
  constructor(private mechanicsService: MechanicsService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current mechanic profile' })
  async getMyProfile(@Request() req: any) {
    return this.mechanicsService.findById(req.user.sub)
  }

  @Get('jobs')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get jobs assigned to current mechanic' })
  async getMyJobs(@Request() req: any) {
    return this.mechanicsService.getJobsForMechanic(req.user.sub)
  }

  @Get('available')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available mechanics near location' })
  async findAvailable(@Body() body: { latitude: number; longitude: number }) {
    return this.mechanicsService.findAvailable(body.latitude, body.longitude)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get mechanic profile' })
  async findOne(@Param('id') id: string) {
    return this.mechanicsService.findById(id)
  }

  @Patch('me/location')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update mechanic location' })
  async updateLocation(
    @Request() req: any,
    @Body() body: { latitude: number; longitude: number }
  ) {
    return this.mechanicsService.updateLocation(req.user.id, body.latitude, body.longitude)
  }

  @Patch('me/availability')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update mechanic availability' })
  async updateAvailability(@Request() req: any, @Body() body: { isAvailable: boolean }) {
    return this.mechanicsService.updateAvailability(req.user.id, body.isAvailable)
  }
}
