import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { UserModel, IUser } from '../models/user.model';
import { loginSchema } from '../zod/schemas/auth.schema';
import { LoginResponseType } from '../dtos/auth.dto';
import { UserResponseType } from '../dtos/user.dto';

type LoginInput = z.infer<typeof loginSchema>['body'];

const toUserResponse = (user: IUser): UserResponseType => {
  return {
    _id: user._id.toString(), 
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export class AuthService {
  static async login(input: LoginInput): Promise<LoginResponseType> {
    const { email, password } = input;

    const user: IUser | null = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciais inválidas');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("ERRO FATAL: A variável de ambiente JWT_SECRET não está definida.");
      throw new Error('Erro de configuração do servidor.');
    }

    const payload = { id: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, secret, { expiresIn: '8h' });

    const userResponse = toUserResponse(user)

    return { user: userResponse, token };
  }
}