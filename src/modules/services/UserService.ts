import { Component, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from '../entities/UserEntity'
import { AbstractService } from '../core/AbstractService'

import * as argon2 from 'argon2'

export interface SignInRequest {
  email: string,
  password: string
}
@Component()
export class UserService extends AbstractService<User> {
  readonly repository: Repository<User>

  constructor (
    @Inject('UserRepositoryToken') userRepository: Repository<User>
  ) {
    super()
    this.repository = userRepository
  }

  public seed (): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  public async signIn (body: SignInRequest): Promise<User | undefined> {
    const user = await this.repository.findOne({ email: body.email })
    return (user !== undefined && await argon2.verify(user.password, body.password)) ? user : undefined
  }
}
