import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }
}
