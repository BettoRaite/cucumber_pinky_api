import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import { Request } from 'express';
import { db } from 'src/database';

export const CheckItemOwnership = createParamDecorator(
  async (table: PgTableWithColumns<any>, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const itemId = request.params.id; // Assuming the item ID is in the route params
    const userId = request.user?.id; // Assuming the user is authenticated and their ID is in the request

    const [item] = await db.select().from(table).where(eq(table.id, itemId)); // Fetch the item from the database
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    if (item.userId !== userId) {
      throw new ForbiddenException('You do not own this item');
    }
    return item; // Optionally return the item for use in the controller
  },
);
