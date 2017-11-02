
import { Module } from '@nestjs/common'
import { UserController } from './UserController'
import { UserService } from './UserService'
import { userProviders } from './UserProviders'
import { DatabaseModule } from '../database/DatabaseModule'

@Module({
  modules: [DatabaseModule],
  controllers: [UserController],
  components: [UserService, ...userProviders]
})
export class UserModule {

}
