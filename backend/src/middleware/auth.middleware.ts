import { Request } from 'express';
import jwt from 'jsonwebtoken';

export interface IRequestWithUser extends Request {
  user?: {
    id: string;
    role: 'admin' | 'editor';
  };
}

export function expressAuthentication(
  request: IRequestWithUser,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === 'jwt') {
    return new Promise((resolve, reject) => {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reject(new Error('Nenhum token fornecido ou formato inválido.'));
      }
      const token = authHeader.split(' ')[1];

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return reject(new Error('Erro de configuração do servidor: chave JWT não definida.'));
      }

      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) {
          return reject(new Error('Token inválido ou expirado.'));
        }

        request.user = {
          id: decoded.id,
          role: decoded.role,
        };
        
        resolve(decoded);
      });
    });
  }

  return Promise.reject(new Error(`Tipo de segurança não suportado: ${securityName}`));
}