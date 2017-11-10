import { test } from 'ava'
import { AbstractCache, TimeUnit, ExpiredAtType, RedisSetting, ExpiredAt }
   from '../../../src/modules/cache/AbstractCache'
import { CacheManager } from '../../../src/modules/cache/CacheManager'

interface TestEntity {
  name: string
  quantity: number
}

@ExpiredAt(new ExpiredAtType(100, TimeUnit.DAYS))
@RedisSetting('testCache', { host: '127.0.0.1', port: 6379 })
class TestCache extends AbstractCache<TestEntity> { }

test('Inject and Get TestCache', async test => {
  const cache = new TestCache()
  const manager = CacheManager.factory()
  manager.caches.push(cache)

  test.deepEqual(manager.getCacheService('testCache'), cache)
})

test('unexpected pull cache', async test => {
  const cache = new TestCache()
  const manager = CacheManager.factory()
  manager.caches.push(cache)

  test.throws(() => manager.getCacheService('some undefined value'))
})
