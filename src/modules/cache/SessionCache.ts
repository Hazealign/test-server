import { AbstractCache, TimeUnit, ExpiredAtType, ExpiredAt, RedisSetting } from './AbstractCache'
import { User } from '../entities/UserEntity'

@ExpiredAt(new ExpiredAtType(1, TimeUnit.DAYS))
@RedisSetting('session', { host: '127.0.0.1', port: 6379 })
export class SessionCache extends AbstractCache<User> {

}
