import { Body, Controller, Post, Route, Tags, Response } from 'tsoa';
import { z } from 'zod';

import { AuthService } from '../services/auth.service';
import { LoginResponseType } from '../dtos/auth.dto';
import { loginSchema } from '../zod/schemas/auth.schema';

type LoginInput = z.infer<typeof loginSchema>['body'];

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {

  @Post("/login")
  @Response(401, "Unauthorized - Credenciais inválidas")
  public async login(@Body() body: LoginInput): Promise<LoginResponseType> {
    try {
      const result = await AuthService.login(body);
      this.setStatus(200); 
      return result;
    } catch (error: any) {
      this.setStatus(401);
      return { message: error.message } as any;
    }
  }
}