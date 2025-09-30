import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { join } from "path";
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const PORT = Number(process.env.PORT) || 3000;
  const apiPrefix = "api/v1";

  const server = app.getHttpAdapter().getInstance() as express.Express;
  server.set('trust proxy', 1);

  app.use(helmet());
 
  app.use(cookieParser());
  if (process.env.REQUEST_LOGS === 'true') {
    app.use(morgan('combined'));
  }
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix(apiPrefix, { exclude: ["docs"] });

  app.use("/uploads", express.static(join(__dirname, "..", "uploads")));


  const config = new DocumentBuilder()
    .setTitle("UzAirways API")
    .setDescription("UzAirways platform endpoints")
    .setVersion("1.0")
    .addTag("UzAirways")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/${apiPrefix}`);
    console.log(`📚 Swagger is available at http://localhost:${PORT}/docs`);
  });
}

bootstrap();
