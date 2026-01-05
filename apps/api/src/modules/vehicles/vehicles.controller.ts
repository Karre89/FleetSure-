import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { VehiclesService } from './vehicles.service'

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'List vehicles for fleet' })
  async findAll(
    @Request() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.vehiclesService.findAll(req.user.fleetId, page, limit)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle details' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.vehiclesService.findById(id, req.user.fleetId)
  }

  @Post()
  @ApiOperation({ summary: 'Add a new vehicle' })
  async create(@Request() req: any, @Body() data: any) {
    return this.vehiclesService.create(req.user.fleetId, data)
  }
}
