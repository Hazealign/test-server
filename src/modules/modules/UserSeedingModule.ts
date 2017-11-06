import { OnModuleInit } from '@nestjs/common/interfaces'
import { UserService } from './../services/UserService'
import { Inject, Module } from '@nestjs/common'
import { DatabaseModule } from '../core/DatabaseModule';
import { userProviders, userServiceProviders } from '../providers/UserProviders';

@Module({
  modules: [DatabaseModule],
  components: [...userProviders, ...userServiceProviders]
})
export class UserSeedingModule implements OnModuleInit {
  constructor (@Inject('UserService') private userService: UserService) {}

  async onModuleInit () {
    if (await this.userService.repository.count() === 0) {
      await this.userService.seed()
    }
  }
}
