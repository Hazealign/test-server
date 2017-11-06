
import { Module, RequestMethod } from '@nestjs/common'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { userProviders } from '../providers/UserProviders'
import { DatabaseModule } from '../core/DatabaseModule'
import { SessionMiddleware } from '../middlewares/SessionMiddleware'
import { MiddlewaresConsumer } from '@nestjs/common/interfaces'

@Module({
  modules: [DatabaseModule],
  controllers: [UserController],
  components: [UserService, ...userProviders]
})
export class UserModule {
  public configure (consumer: MiddlewaresConsumer) {
    consumer.apply(SessionMiddleware).forRoutes(
      { path: '/users', method: RequestMethod.GET },
      { path: '/users/:userId', method: RequestMethod.GET },
      { path: '/users/:userId', method: RequestMethod.PATCH },
      { path: '/users/:userId', method: RequestMethod.DELETE }
    )
  }
}
