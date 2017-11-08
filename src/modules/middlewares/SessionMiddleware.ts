import { SessionCache } from '../cache/SessionCache'
import { Response, sendResponse } from '../core/Constants'
import { CacheManager } from '../cache/CacheManager'
import { Middleware } from '@nestjs/common'
import { NestMiddleware, ExpressMiddleware } from '@nestjs/common/interfaces'

// Express Request 타입에 User 변수가 들어올 수 있도록 추가
@Middleware()
export class SessionMiddleware implements NestMiddleware {
  resolve (...args: any[]): ExpressMiddleware {
    const userCache: SessionCache = CacheManager.factory().getCacheService('session')

    return async (req, res, next) => {
      if (!req.headers['authorization']) {
        sendResponse(res, Response.catch(401))
      }

      const user = await userCache.get(req.headers['authorization'])
      req.user = user
      return next()
    }
  }
}
