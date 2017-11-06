import { UserSeedingModule } from './modules/UserSeedingModule'
import { UserModule } from './modules/UserModule'
import { Module } from '@nestjs/common'

@Module({ modules: [UserModule, UserSeedingModule] })
export class ApplicationModule {}
