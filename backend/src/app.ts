import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
  ErrorRequestHandler,
} from 'express';
import swaggerUi from 'swagger-ui-express';
import { ValidateError } from 'tsoa';
import cors from 'cors'; 

import { connectDB } from './config/database';
import { RegisterRoutes } from '../dist/routes'; 
const startServer = async () => {
  await connectDB();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());

  app.use('/api-docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    try {
      const swaggerDocument = await import('../dist/swagger.json');
      res.send(swaggerUi.generateHTML(swaggerDocument));
    } catch (error) {
      res.status(404).send("Documentação não encontrada. Execute 'npm run dev' para gerar.");
    }
  });
  
  RegisterRoutes(app);

  // --- MIDDLEWARE DE TRATAMENTO DE ERROS ---
  app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      console.error("ERRO CAPTURADO PELO SERVIDOR:", err);

      if (err.message === 'Este slug já está em uso.') {
          return res.status(409).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }

    next();
  } as ErrorRequestHandler);

  // --- INICIALIZAÇÃO DO SERVIDOR ---
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação do Swagger disponível em http://localhost:${PORT}/api-docs`);
  });
};

startServer();