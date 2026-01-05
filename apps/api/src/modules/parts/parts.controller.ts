import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { PartsService } from './parts.service'

@ApiTags('Parts')
@Controller()
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PartsController {
  constructor(private partsService: PartsService) {}

  @Get('jobs/:jobId/parts')
  @ApiOperation({ summary: 'Get parts for a job' })
  async findByJob(@Param('jobId') jobId: string) {
    return this.partsService.findByJobId(jobId)
  }

  @Post('jobs/:jobId/parts')
  @ApiOperation({ summary: 'Request a part for a job' })
  async requestPart(@Param('jobId') jobId: string, @Body() data: any) {
    return this.partsService.requestPart(jobId, data)
  }

  @Get('parts/vendors')
  @ApiOperation({ summary: 'Get available vendors' })
  async getVendors(@Query('state') state?: string) {
    return this.partsService.getVendors(state)
  }
}
