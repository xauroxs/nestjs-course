import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(dto);
  }
}
