import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

export interface Users {
  id: number;
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  private users: Users[] = [];

  findAll() {
    return this.users;
  }

  create(createUserDto: CreateUserDto) {
    const newUser: Users = {
      id: this.users.length + 1,
      ...createUserDto,
    };

    this.users.push(newUser);

    return newUser;
  }
}