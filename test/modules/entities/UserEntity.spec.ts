import { test } from 'ava'
import * as argon2 from 'argon2'
import { User } from '../../../src/modules/entities/UserEntity'

test('Hash Password works.', async test => {
  const value = 'test'
  const user = new User()
  await user.setPassword(value)

  test.true(await argon2.verify(user.password, value))
})
