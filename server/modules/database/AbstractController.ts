import { Response, sendResponse } from '../common/Constants'
import { Request as RequestType, Response as ResponseType } from 'express'
import { Body, HttpStatus, Param, Query, Request as Req, Response as Resp } from '@nestjs/common'
import { AbstractService } from './AbstractService'

export interface QueryType {
  pageNo: number,
  length: number,
  values: { [key: string]: any },
  sortKey: string,
  sortDesc: 'ASC' | 'DESC'
}

export abstract class AbstractController<T> {
  abstract service: AbstractService<T>

  constructor (service: AbstractService<T>) {
    this.service = service
  }

  sendResponse (res: ResponseType, resp: Response) {
    const { code, value } = resp
    res.status(code).json(value)
  }

  public async post (@Req() req: RequestType, @Resp() res: ResponseType, @Body() entity: T) {
    const added = await this.service.upsert(entity)
    sendResponse(res, new Response(HttpStatus.OK, added))
  }

  public async get (@Req() req: RequestType, @Resp() res: ResponseType, @Query() query: QueryType) {
    const result = await this.service.find(query)
    sendResponse(res, new Response(HttpStatus.OK, result))
  }

  public async getOne (@Req() req: RequestType, @Resp() res: ResponseType, @Param('id') id: number) {
    const result = await this.service.findById(id)
    if (result === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      sendResponse(res, new Response(HttpStatus.OK, result))
    }
  }

  public async patch (@Req() req: RequestType, @Resp() res: ResponseType, @Param('id') id: number, @Body() body: T) {
    const result = await this.service.findById(id)
    if (result === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      const entity = Object.assign<T, T>(result, body)
      await this.service.upsert(entity)
      sendResponse(res, new Response(HttpStatus.OK, entity))
    }
  }

  public async delete (@Req() req: RequestType, @Resp() res: ResponseType, @Param('id') id: number) {
    const result = await this.service.findById(id)
    if (result === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      await this.service.remove(result)
      sendResponse(res, new Response(HttpStatus.OK, result))
    }
  }
}
