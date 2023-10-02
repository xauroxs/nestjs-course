import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './user.entity';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private jwtService: JwtService,
  ) {}

  private async createUser(dto: AuthCredentialsDto): Promise<void> {
    const { username, password } = dto;

    const salt = await bcrypt.genSalt();
    const saltedPassword = (await bcrypt.hash(password, salt)) as string;

    const user = this.usersRepository.create({
      username,
      password: saltedPassword,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username is already taken');
      } else {
        this.logger.error('Error creating a user', error.stack);

        throw new InternalServerErrorException();
      }
    }
  }

  async signUp(dto: AuthCredentialsDto): Promise<void> {
    return this.createUser(dto);
  }

  async signIn(dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username, password } = dto;

    const user = await this.usersRepository.findOneBy({ username });

    const doesPasswordsMatch = await bcrypt.compare(password, user.password);

    if (user && doesPasswordsMatch) {
      const payload: JwtPayload = { username };

      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Login or password are invalid');
    }
  }
}
