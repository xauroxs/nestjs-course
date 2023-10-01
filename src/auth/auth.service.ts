import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async createUser(dto: AuthCredentialsDto): Promise<void> {
    const { username, password } = dto;

    const user = this.usersRepository.create({
      username,
      password,
    });

    await this.usersRepository.save(user);
  }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    return this.createUser(dto);
  }
}
