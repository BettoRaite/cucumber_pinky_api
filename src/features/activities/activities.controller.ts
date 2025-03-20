import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Request } from 'express';
import { CheckItemOwnership } from 'src/shared/decorators/check-item-ownership.decorator';
import { activitiesTable, ActivitySelect } from 'src/database/schema';
import { User } from 'src/shared/decorators/user.decorator';
import { UserJWT } from 'src/lib/types/types';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @User() user: UserJWT,
  ) {
    await this.activitiesService.create({
      ...createActivityDto,
      userId: user.id,
    });
    return;
  }

  @Get()
  async findAll(@Req() req: Request, @User() user: UserJWT) {
    const items = await this.activitiesService.findAll({
      filters: {
        userId: user.id,
      },
    });
    return {
      data: items,
    };
  }

  @Get(':id')
  async findOne(@CheckItemOwnership(activitiesTable) item: ActivitySelect) {
    const i = await this.activitiesService.findOne({
      filters: {
        id: item.id,
      },
    });
    return {
      data: i,
    };
  }

  @Patch(':id')
  async update(
    @Body() updateActivityDto: UpdateActivityDto,
    @CheckItemOwnership(activitiesTable) item: ActivitySelect,
  ) {
    await this.activitiesService.update(item.id, updateActivityDto);
    return;
  }

  @Delete(':id')
  async remove(@CheckItemOwnership(activitiesTable) item: ActivitySelect) {
    await this.activitiesService.remove(item.id);
    return;
  }
}
