import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import { DirectOptions } from 'nodemailer-direct-transport'

const testConfig = {
  'database': {
    'type': 'sqlite',
    'database': 'database.db',
    'synchronize': true,
    'logging': false,
    'name': new Date().getTime().toString()
  },
  'redis': {
    'host': '127.0.0.1',
    'port': 6379
  },
  'server': {
    'host': '127.0.0.1',
    'port': 3000
  }, 'baseDir': 'D:\\'
}

export interface ServerInfo {
  host: string
  port: number
}

export class Configuration {
  database: ConnectionOptions
  redis: ServerInfo
  server: ServerInfo
  sentry: string
  baseDir: string
  email: DirectOptions

  constructor (json: any) {
    json.database.entities = [ '**/**Entity.ts']
    this.database = json.database as ConnectionOptions
    this.redis = json.redis as ServerInfo
    this.server = json.server as ServerInfo
    this.sentry = 'https://b2d5997ca36f47b380c88ba697dd86ca@sentry.io/240126'
    this.baseDir = json.baseDir
    this.email = json.email as DirectOptions
  }
}

export function getConfiguration (): Configuration {
  const arg = process.argv[2]
  const result = arg === 'develop' ? require('./../config/develop') : testConfig

  return new Configuration(result)
}
