import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return this.repository.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;
    return this.repository.findOne({ where: { id } });
  }

  async find(email: string) {
    return this.repository.find({ where: { email } });
  }
}
