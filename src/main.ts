import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WinstonLoggerService } from '@logger/winston-logger.service'
import express from 'express'
import { ValidationPipe } from '@nestjs/common'
import { ValidationErrorException } from '@exceptions/validation-error.exception'
import { ConfigService } from '@nestjs/config'
import { SystemConfig } from '@config/system.config'

async function bootstrap() {
  const logger = new WinstonLoggerService()
  const app = await NestFactory.create(AppModule, {
    logger
  })

  const configService: ConfigService<SystemConfig, true> =
    app.get(ConfigService)

  app.enableCors()
  app.use(express.json())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => new ValidationErrorException(errors)
    })
  )

  const port: number = configService.get('port')

  await app.listen(port, () => {
    logger.log(`Server initialized in port: ${port}`)
  })
}

bootstrap().then()
