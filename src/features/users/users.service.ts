import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSelect, usersTable } from 'src/database/schema';
import { db } from 'src/database';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    await db.insert(usersTable).values(createUserDto);
  }

  async findAll() {
    return await db.select().from(usersTable);
  }

  async findOneBy({ email }: Partial<UserSelect>) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email as string))
      .limit(1);
    return result.at(0);
  }

  update(id: number, updateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
