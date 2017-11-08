import { sendMail } from '../../utils/MailSender'
import { User } from '../entities/UserEntity'
import { AbstractController, QueryType } from '../core/BaseController'
import { Get, Query, Request as Req, Response as Resp, Controller, Post, HttpStatus, Patch, Body, Param } from '@nestjs/common'
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
    delete body.approved
    delete body.approvedAt
    delete body.emailConfirmed
    super.patch(req, res, id, body)
  }

  // @Delete('/users/:userId')
  // public async delete (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id) {
  //   super.delete(req, res, id)
  // }

  @Get('/users/:userId/confirm/:token')
  public async confirm (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id: number, @Param('token') token: string) {
    const cache = CacheManager.factory().getCacheService('session')
    const user = await cache.get(token)
    if (!user) {
      sendResponse(res, Response.catch(404))
      return
    }

    const result = await this.service.emailConfirm(user)
    sendResponse(res, new Response(HttpStatus.OK, { user: result }))
  }

  @Post('/users/:userId/approve')
  public async approve (@Req() req: RequestType, @Resp() res: ResponseType, @Param('userId') id: number) {
    const user = await this.service.findById(id)
    if (user === undefined || req.user === undefined) {
      sendResponse(res, Response.catch(404))
      return
    }

    const result = await this.service.approveUser(req.user, user)
    sendResponse(res, new Response(HttpStatus.OK, { user: result }))
  }

  @Post('/users')
  public async post (@Req() req: RequestType, @Resp() res: ResponseType, @Body() body: User) {
    body.approved = false
    body.approvedAt = null
    body.emailConfirmed = false

    const added = {}
    const result = await this.service.upsert(body)
    added[pluralize.singular(this.endPoint)] = result

    const cache: SessionCache = CacheManager.factory().getCacheService('session')
    const key = cache.hashByTimestamp()
    await cache.set(key, result)
    await sendMail(result.email, '[EvidNET] Mail Authorization',
      `Press <a href="http://evidnet.net/api/users/${result.id}/confirm/${key}">this link</a>.`, true)

    sendResponse(res, new Response(HttpStatus.OK, added))
  }

  @Post('/users/authorize')
  public async signIn (@Req() req: RequestType, @Resp() res: ResponseType, @Body() body: SignInRequest) {
    const user = await this.service.signIn(body)
    if (user !== undefined) {
      const cache: SessionCache = CacheManager.factory().getCacheService('session')
      const key = cache.hashByTimestamp()
      await cache.set(key, user)

      sendResponse(res, new Response(HttpStatus.OK, { user: user, key }))
    } else {
      sendResponse(res, Response.catch(404))
    }
  }
}
