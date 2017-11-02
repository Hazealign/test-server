import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions'

export enum FilesProvider {
  Disk = 'Disk'
  // AmazonS3 = 'AmazonS3'
}

export class Configuration {
  database: ConnectionOptions
  redis: any
  port: number
  files: FileConfig
  sentry: string

  constructor (json: any) {
    json.database.entities = [ __dirname + '/../**/**Entity{.js,.ts}']

    this.database = json.database as ConnectionOptions
    this.redis = {}
    this.port = json.port
    this.sentry = json.sentry
    this.files = {
      provider: FilesProvider[json.files.provider as string],
      directory: (json.files.directory as string)
    }
  }
}

export interface FileConfig {
  provider: FilesProvider,
  directory: string,
  // connection?: any
}

export function getConfiguration (): Configuration {
  const arg = process.argv[2]
  try {
    return new Configuration(require(`./../configs/${arg}`))
  } catch (ex) {
    throw new Error(`Can't find valid config args. ${arg}`)
  }
}
