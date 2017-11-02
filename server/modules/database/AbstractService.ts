import { QueryType } from './BaseController'
import { FindManyOptions, Repository } from 'typeorm'

export abstract class AbstractService<T> {
  abstract repository: Repository<T>

  constructor () {
    this.seed()
  }

  abstract seed (): Promise<void>

  public async upsert (entity: T): Promise<T> {
    return (await this.repository).persist(entity)
  }

  public async createAll (entity: T[]): Promise<T[]> {
    return (await this.repository).persist(entity)
  }

  public async findById (id: number): Promise<T | undefined> {
    return (await this.repository).findOneById(id)
  }

  public async findRaw (options?: FindManyOptions<T>): Promise<T[]> {
    return (await this.repository).find(options)
  }

  public async find (query: QueryType): Promise<T[]> {
    const order = {}
    if (query.sortKey !== undefined) {
      order[query.sortKey] = query.sortDesc
    }

    const opt: FindManyOptions<T> = {
      where: query.values,
      order: order,
      skip: (query.pageNo - 1) * query.length,
      take: query.length
    }

    return (await this.repository).find(opt)
  }

  public async remove (entity: T): Promise<T> {
    return (await this.repository).remove(entity)
  }
}
