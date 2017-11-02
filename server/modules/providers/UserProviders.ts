import { Connection } from 'typeorm'
import { User } from '../entities/UserEntity'

export const userProviders = [
  {
    provide: 'UserRepositoryToken',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DbConnectionToken']
  }
]
