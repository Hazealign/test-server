import { test } from 'ava'
import { UserService } from '../../../src/modules/services/UserService'
import { User } from '../../../src/modules/entities/UserEntity'
import { getConfiguration } from '../../../src/utils/Configuration'
import { createConnection } from 'typeorm'

let service: UserService | undefined = undefined

async function constructService () {
  const connection = await createConnection(getConfiguration().database)
  const repo = connection.getRepository(User)

  return new UserService(repo)
}

test.before(async test => {
  service = await constructService()
})

test('assert service is not null', async test => {
  test.false(service === undefined || service === null)
})
