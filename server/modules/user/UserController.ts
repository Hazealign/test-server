import { AbstractService } from '../database/AbstractService'
import { User } from './UserEntity'
import { AbstractController, QueryType } from '../database/BaseController'
import { Get, Query, Request as Req, Response as Resp, Controller } from '@nestjs/common'
import { Request as RequestType, Response as ResponseType } from 'express'
import { UserService } from './UserService'

@Controller('users')
export class UserController extends AbstractController<User> {
  readonly service: AbstractService<User>

  constructor (userService: UserService) {
    super(userService, 'users')
  }

  @Get()
  public async get (@Req() req: RequestType, @Resp() res: ResponseType,
    @Query() query: QueryType) {
    return super.get(req, res, query)
  }
}
