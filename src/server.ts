import { User } from './modules/entities/UserEntity'
import { getConfiguration } from './utils/Configuration'
import { ApplicationModule } from './modules/ApplicationModule'
import { NestFactory } from '@nestjs/core'
const Raven = require('raven')

// Typeorm Shim for use reflecting metadata
import 'reflect-metadata'

import * as express from 'express'
import * as bodyParser from 'body-parser'

declare module 'express' {
  interface Request {
    user: User | undefined
  }
}

async function bootstrap () {
  const conf = getConfiguration()
  Raven.config(conf.sentry).install()

  const instance = express()
  instance.use(Raven.requestHandler())
  instance.use(bodyParser.json())
  instance.use(Raven.requestHandler())

  const nestApp = await NestFactory.create(ApplicationModule)
  await nestApp.listen(conf.server.port)
}

// for graceful debugging :)
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

bootstrap()
