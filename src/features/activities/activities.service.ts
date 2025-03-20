import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { db } from 'src/database';
import {
  activitiesTable,
  ActivityInsert,
  ActivitySelect,
  UserSelect,
} from 'src/database/schema';
import { constructWhereQuery } from 'src/database/helpers/constructWhereQuery';
import { QueryOptions } from 'src/lib/types/types';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActivitiesService {
  async create(item: ActivityInsert) {
    console.log(item);
    return db.insert(activitiesTable).values(item);
  }

  async findAll(queryOptions: QueryOptions<ActivitySelect>) {
    const whereQuery = constructWhereQuery({
      table: activitiesTable,
      ...queryOptions,
    });
    return db.select().from(activitiesTable).where(whereQuery);
  }

  async findOne(queryOptions: QueryOptions<ActivitySelect>) {
    const whereQuery = constructWhereQuery({
      table: activitiesTable,
      ...queryOptions,
    });
    const [item] = await db
      .select()
      .from(activitiesTable)
      .where(whereQuery)
      .limit(1);
    return item;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {
    return db
      .update(activitiesTable)
      .set(updateActivityDto)
      .where(eq(activitiesTable.id, id));
  }

  async remove(id: number) {
    return db.delete(activitiesTable).where(eq(activitiesTable.id, id));
  }
}
