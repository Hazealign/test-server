import { Module } from '@nestjs/common'
import { UserModule } from './user/UserModule'

@Module({ modules: [UserModule] })
export class ApplicationModule {}
