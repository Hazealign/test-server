import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'
import { DirectOptions } from 'nodemailer-direct-transport'

export enum FilesProvider {
  Disk = 'Disk'
  // AmazonS3 = 'AmazonS3'
}

let developConf = {
  'database': {
    'type': 'mssql',
    'host': 'localhost',
    'port': 1433,
    'username': 'sa',
    'password': 'T3stLog1n',
    'database': 'Evidnet',
    'autoSchemaSync': true
  }, 'port': 3000,
  'sentry': '',
  'files': {
    'provider': 'Disk',
    'directory': 'C:\\Users\\Realignist\\Desktop\\Evidnet'
  }, 'email': {
    'secure': true,
    'port': 465,
    'auth': {
      'user': 'evidnet.master@gmail.com',
      'pass': 'qwer1234!@'
    }
  }
}

export class Configuration {
  database: ConnectionOptions
  redis: RedisConfig
  port: number
  files: FileConfig
  sentry: string
  email: DirectOptions

  constructor (json: any) {
    json.database.entities = [ __dirname + '/../**/**Entity{.js,.ts}']

    this.email = json.email as DirectOptions
    this.database = json.database as ConnectionOptions
    this.redis = json.redis as RedisConfig
    this.port = json.port
    this.sentry = json.sentry
    this.files = {
      provider: FilesProvider[json.files.provider as string],
      directory: (json.files.directory as string)
    }
  }
}

export interface RedisConfig {
  host: string,
  port: number
}

export interface FileConfig {
  provider: FilesProvider,
  directory: string,
  // connection?: any
}

export function getConfiguration (): Configuration {
  const arg = process.argv[2]

  if (arg === 'runner') return new Configuration(developConf)

  try {
    return new Configuration(require(`./../config/${arg}`))
  } catch (ex) {
    throw new Error(`Can't find valid config args. ${arg}`)
  }
}
