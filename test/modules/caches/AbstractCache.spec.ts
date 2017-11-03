import { AbstractCache, ExpiredAt, ExpiredAtType, RedisSetting, TimeUnit } from '../../../server/modules/cache/AbstractCache'
import { test } from 'ava'

interface TestEntity {
  name: string
  quantity: number
}

@ExpiredAt(new ExpiredAtType(100, TimeUnit.DAYS))
@RedisSetting('testCache', { host: '127.0.0.1', port: 6379, options: {} })
class TestCache extends AbstractCache<TestEntity> { }

@ExpiredAt(new ExpiredAtType())
class InvalidTestCache extends AbstractCache<TestEntity> { }

@RedisSetting('test2Cache', { host: '127.0.0.1', port: 6379, options: {} })
class Test2Cache extends AbstractCache<TestEntity> { }

test('TestCache class can save and read entity.', async test => {
  const cache = new TestCache()
  const hash = cache.hashByTimestamp()
  const value: TestEntity = {
    name: '테스트', quantity: 100
  }

  test.deepEqual(await cache.set(hash, value), value)
  test.deepEqual((await cache.get(hash)), value)
})

test('Cache without Decorator must not work.', async test => {
  test.throws(() => new InvalidTestCache(), 'undefined assertions.')
})

test('Test2Cache class can save and read without ExpiredAt decorator.', async test => {
  const cache = new Test2Cache()
  const hash = cache.hashByTimestamp()
  const value: TestEntity = {
    name: '테스트', quantity: 100
  }

  test.deepEqual(await cache.set(hash, value), value)
  test.deepEqual((await cache.get(hash)), value)
})

test('expiredAt is not undefined or expiredDate is not undefined', async test => {
  const cache = new TestCache()
  const hash = cache.hashByTimestamp()
  const value: TestEntity = {
    name: '테스트', quantity: 100
  }

  test.deepEqual(await cache.set(hash, value, new ExpiredAtType(10, TimeUnit.MONTHS)), value)
  test.deepEqual((await cache.get(hash)), value)
})
