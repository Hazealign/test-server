import { test } from 'ava'
import { Column, createConnection, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { AbstractService } from '../../../server/modules/database/AbstractService'
import { Repository } from 'typeorm/repository/Repository'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { QueryType } from '../../../server/modules/database/BaseController'

const dbSetting: SqliteConnectionOptions = {
  type: 'sqlite',
  database: 'database.db',
  synchronize: true,
  logging: false,
  entities: [
    './test/modules/database/AbstractService.spec.ts'
  ]
}

@Entity()
class TestEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @Column('simple-array')
  tags: string[]
}

class TestService extends AbstractService<TestEntity> {
  repository: Repository<TestEntity>

  constructor (repository: Repository<TestEntity>) {
    super()
    this.repository = repository
  }

  seed (): Promise<void> {
    return new Promise((resolve, reject) => resolve())
  }
}

async function constructTestService () {
  const connection = await createConnection(dbSetting)
  const repo = connection.getRepository(TestEntity)

  return new TestService(repo)
}

test('Test It can "CREATE"', async test => {
  const service = await constructTestService()
  const query: QueryType = { pageNo: 0, length: 0, values: {} }

  const entity = new TestEntity()
  entity.createdAt = new Date()
  entity.tags = ['1', 'a', ' ']

  test.true((await service.count(query)) === 0)
  service.upsert(entity)
  test.true((await service.count(query)) === 1)

  service.repository.clear()
})
