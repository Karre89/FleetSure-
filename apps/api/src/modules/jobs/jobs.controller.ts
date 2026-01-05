import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { JobsService } from './jobs.service'

@ApiTags('Jobs')
@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List jobs' })
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    return this.jobsService.findAll(req.user.fleetId, { status, page, limit })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job details' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Create a new job request' })
  async create(@Request() req: any, @Body() data: any) {
    return this.jobsService.create(req.user.fleetId, data)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update job status' })
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: string; notes?: string }
  ) {
    return this.jobsService.updateStatus(id, body.status, req.user.id, body.notes)
  }
}
