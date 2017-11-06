
import { Module } from '@nestjs/common'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'
import { userProviders } from '../providers/UserProviders'
import { DatabaseModule } from '../core/DatabaseModule'

@Module({
  modules: [DatabaseModule],
  controllers: [UserController],
  components: [UserService, ...userProviders]
})
export class UserModule {

}
