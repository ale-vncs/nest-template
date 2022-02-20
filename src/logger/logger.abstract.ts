import { LoggerService } from '@nestjs/common'

export abstract class LoggerAbstract implements LoggerService {
  abstract debug(message: any, ...optionalParams: any[]): void

  abstract error(message: any, ...optionalParams: any[]): void

  abstract log(message: any, context?: string): void

  abstract verbose(message: any, ...optionalParams: any[]): void

  abstract warn(message: any, ...optionalParams: any[]): void

  abstract info(message: any, ...optionalParam: any[]): void

  abstract setContext(context: string): void

  protected buildWithOptionalParam(message: any, optionalParam: any[]) {
    if (typeof message === 'string') {
      optionalParam.forEach((param) => {
        message = message.replace('{}', param)
      })
    }
    return message
  }
}
