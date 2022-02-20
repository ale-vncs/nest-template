import { LoggerAbstract } from '@logger/logger.abstract'
import { ConfigService } from '@nestjs/config'

export abstract class AbstractService {
  constructor(logger: LoggerAbstract, config: ConfigService) {}
}
