import { Connection } from 'typeorm'
import { User } from '../entities/UserEntity'
import { Repository } from 'typeorm/repository/Repository'
import { UserService } from '../services/UserService'

export const userProviders = [
  {
    provide: 'UserRepositoryToken',
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DbConnectionToken']
  }
]

export const userServiceProviders = [
  {
    provide: 'UserService',
    useFactory: (repository: Repository<User>) => new UserService(repository),
    inject: ['UserRepositoryToken']
  }
]
