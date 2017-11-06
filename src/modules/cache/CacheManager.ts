import { SessionCache } from './SessionCache'
import { AbstractCache } from './AbstractCache'
import { AssertionError } from 'assert'

export abstract class CacheManager {
  abstract caches: AbstractCache<any>[]
  static factory (): CacheManager {
    return new CacheManagerImpl()
  }

  abstract getCacheService (key: string): AbstractCache<any>
}

class CacheManagerImpl extends CacheManager {
  caches: AbstractCache<any>[] = [
    new SessionCache()
  ]

  getCacheService (key: string): AbstractCache<any> {
    const candidates = this.caches.filter(cache => cache.prefix === key)
    if (candidates.length > 0) return candidates[0]
    else throw new AssertionError()
  }
}
