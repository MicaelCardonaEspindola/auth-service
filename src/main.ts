require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
process.env.DEBUG = "qapi:*";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    logger:
      process.env.NODE_ENV === "production"
        ? ["error", "warn"]
        : ["log", "error", "warn", "debug", "verbose"],
  });
  app.enableCors();
  const port = process.env.PORT || 5000;
  await app.listen(port);
  console.log(`🚀 Auth service is running on: http://localhost:${port}/graphql`);
}
bootstrap();
