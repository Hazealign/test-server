import { Component, Inject } from '@nestjs/common'
import { Repository } from 'typeorm'
import { User } from '../entities/UserEntity'
import { AbstractService } from '../core/AbstractService'

import * as argon2 from 'argon2'
import { PermissionType } from '../entities/PermissionEntity'

export interface SignInRequest {
  email: string,
  password: string
}

export interface IUserService {
  signIn (body: SignInRequest): Promise<User | undefined>
  emailConfirm (user: User): Promise<User>
  approveUser (approver: User, user: User): Promise<User>
}

@Component()
export class UserService extends AbstractService<User> implements IUserService {
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

  public async emailConfirm (user: User): Promise<User> {
    user.emailConfirmed = true
    return await this.upsert(user)
  }

  public async approveUser (approver: User, user: User): Promise<User> {
    // 1. 전체 관리자면 통과
    let firstOpt = approver.permissions.map(permission => permission.type)
      .indexOf(PermissionType.CentralManager) !== -1

    // 2. 부분 관리자 && 나랑 같은 organization
    let secondOpt = approver.permissions.map(permission => permission.type)
      .indexOf(PermissionType.CentralManager) !== -1 &&
      approver.organization.id === user.organization.id

    // 조건 만족 못하면 밴.
    if (!(firstOpt || secondOpt)) throw new Error('Permission Denied.')

    user.approved = true
    user.approvedAt = new Date()
    return await this.upsert(user)
  }
}
