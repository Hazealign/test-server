import * as Redis from 'ioredis'
import * as crypto from 'crypto'
import { RedisConfig } from '../../utils/Configuration'

export enum TimeUnit {
  YEARS = 1000 * 60 * 60 * 24 * 365,
  MONTHS = 1000 * 60 * 60 * 24 * 30,
  DAYS = 1000 * 60 * 60 * 24,
  HOURS = 1000 * 60 * 60,
  MINUTES = 1000 * 60,
  SECONDS = 1000
}

export class ExpiredAtType {
  time: number
  unit: TimeUnit

  constructor (time?: number, unit?: TimeUnit) {
    this.time = (time === undefined) ? 0 : time
    this.unit = (unit === undefined) ? TimeUnit.DAYS : unit
  }
}

// ------------- Class Decorators

export function RedisSetting (prefix: string, config: RedisConfig) {
  return (target: Function) => {
    target.prototype.prefix = prefix
    target.prototype.setting = config
  }
}

export function ExpiredAt (expiredAt: ExpiredAtType) {
  return (target: Function) => {
    target.prototype.expiredAt = expiredAt
  }
}

// ------------- Real Class
export abstract class AbstractCache<T> {
  connection: Redis.Redis

  // @ts-ignore
  prefix: string
  // @ts-ignore
  private setting: RedisConfig
  // @ts-ignore
  private expiredAt: ExpiredAtType

  constructor () {
    if (this.setting === undefined || this.prefix === undefined) {
      throw new Error('undefined assertions.')
    }

    const { port, host, options } = this.setting
    this.connection = new Redis(port, host, options)
  }

  get (key: string): Promise<T> {
    return this.connection.get(`${this.prefix}_${key}`).then((result) => {
      return JSON.parse(result)
    })
  }

  async set (key: string, value: T, expiredAt?: ExpiredAtType): Promise<T> {
    const prom = this.connection.set(`${this.prefix}_${key}`, JSON.stringify(value))

    if (expiredAt !== undefined) {
      return prom.then(() => {
        this.connection.pexpire(`${this.prefix}_${key}`, expiredAt.time * expiredAt.unit.valueOf())
      }).then(() => value)
    } else {
      if (this.expiredAt !== undefined) {
        return prom.then(() => {
          this.connection.pexpire(`${this.prefix}_${key}`, this.expiredAt.time * this.expiredAt.unit.valueOf())
        }).then(() => value)
      } else return prom.then(() => value)
    }
  }

  hashByTimestamp (): string {
    return crypto.createHash('sha512')
      .update(new Date().getTime().toString()).digest('base64')
  }
}
