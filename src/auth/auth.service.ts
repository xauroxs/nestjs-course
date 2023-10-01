import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

    try {
      await this.usersRepository.save(user);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Username is already taken');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    return this.createUser(dto);
  }
}
