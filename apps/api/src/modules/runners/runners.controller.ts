import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { RunnersService } from './runners.service'

@ApiTags('Runners')
@Controller('runners')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class RunnersController {
  constructor(private runnersService: RunnersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get runner profile' })
  async getProfile(@Request() req: any) {
    return this.runnersService.findById(req.user.id)
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get assigned tasks' })
  async getTasks(@Request() req: any) {
    return this.runnersService.getTasks(req.user.id)
  }

  @Patch('me/availability')
  @ApiOperation({ summary: 'Update runner availability' })
  async updateAvailability(@Request() req: any, @Body() body: { isAvailable: boolean }) {
    return this.runnersService.updateAvailability(req.user.sub, body.isAvailable)
  }

  @Patch('tasks/:id/status')
  @ApiOperation({ summary: 'Update task status' })
  async updateTaskStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.runnersService.updateTaskStatus(id, body.status)
  }

  @Patch('tasks/:id/accept')
  @ApiOperation({ summary: 'Accept a task' })
  async acceptTask(@Param('id') id: string) {
    return this.runnersService.updateTaskStatus(id, 'ACCEPTED')
  }
}
