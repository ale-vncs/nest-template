import { MiddlewareConsumer, Module, Scope } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { LoggerModule } from '@logger/logger.module'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsuarioModule } from '@modules/usuarios/usuario.module'
import { systemConfig } from '@config/system.config'
import { ContextModule } from '@context/context.module'
import helmet from 'helmet'
import { ConfigMiddleware } from '@middlewares/config.middleware'
import { ScheduleModule } from '@nestjs/schedule'
import { TaskModule } from './app/scheduler/task.module'
import { AllExceptionsFilter } from '@filters/all-exceptions.filter'

@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
      scope: Scope.DEFAULT
    },
    AppService
  ],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [systemConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('database', { infer: true })
    }),
    ContextModule,
    LoggerModule,
    UsuarioModule,
    TaskModule
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet(), ConfigMiddleware).forRoutes('*')
  }
}
