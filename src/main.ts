import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: 'toPersonsMs',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices().then(() => {
    console.log(
      `Persons MS started on ${process.env.APP_PORT} at ${new Date()}.`,
    );
    console.log('Application variables:');
    console.log('RabbitMQ address: ', process.env.RMQ_URL);
    console.log('Database host: ', process.env.DATABASE_HOST);
    console.log('Database port: ', process.env.DATABASE_PORT);
  });
  await app.listen(1234);
}

bootstrap();
