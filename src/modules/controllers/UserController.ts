import { User } from '../entities/UserEntity'
import { AbstractController, QueryType } from '../core/BaseController'
import { Get, Query, Request as Req, Response as Resp, Controller, Post, HttpStatus, Patch, Delete, Body, Param } from '@nestjs/common'
import { Request as RequestType, Response as ResponseType } from 'express'
import { UserService, SignInRequest } from '../services/UserService'
import { SessionCache } from '../cache/SessionCache'
import { CacheManager } from '../cache/CacheManager'
import { sendResponse, Response } from '../core/Constants'

@Controller()
export class UserController extends AbstractController<User> {
  readonly service: UserService

  constructor (userService: UserService) {
    super(userService, 'users')
  }

  @Get('/users')
  public async get (@Req() req: RequestType, @Resp() res: ResponseType,
    @Query() query: QueryType) {
    return super.get(req, res, query)
  }

  @Get('/users/:userId')
  public async getOne (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id) {
    super.getOne(req, res, id)
  }

  @Patch('/users/:userId')
  public async patch (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id, @Body() body: User) {
    super.patch(req, res, id, body)
  }

  @Delete('/users/:userId')
  public async delete (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id) {
    super.delete(req, res, id)
  }

  @Post('/users')
  public async post (@Req() req: RequestType, @Resp() res: ResponseType, @Body() body: User) {
    super.post(req, res, body)
  }

  @Post('/users/sign-in')
  public async signIn (@Req() req: RequestType, @Resp() res: ResponseType, @Body() body: SignInRequest) {
    const user = await this.service.signIn(body)
    if (user !== undefined) {
      const cache: SessionCache = CacheManager.factory().getCacheService('session')
      const key = cache.hashByTimestamp()
      await cache.set(key, user)

      const censored = JSON.parse(JSON.stringify(user))
      delete censored.password
      sendResponse(res, new Response(HttpStatus.OK, { user: censored, key }))
    } else {
      sendResponse(res, Response.catch(404))
    }
  }
}
