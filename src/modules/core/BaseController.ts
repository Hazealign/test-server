import { Response, sendResponse } from '../core/Constants'
import { Request as RequestType, Response as ResponseType } from 'express'
import { HttpStatus } from '@nestjs/common'
import { AbstractService } from './AbstractService'
import * as pluralize from 'pluralize'

export interface QueryType {
  pageNo: number,
  length: number,
  values: { [key: string]: any },
  sortKey?: string,
  sortDesc?: 'ASC' | 'DESC'
}

export abstract class EmptyController<T> {
  abstract service: AbstractService<T>

  constructor (service: AbstractService<T>) {
    this.service = service
  }

  sendResponse (res: ResponseType, resp: Response) {
    const { code, value } = resp
    res.status(code).json(value)
  }
}

export abstract class AbstractController<T> {
  abstract service: AbstractService<T>
  readonly endPoint: string

  constructor (service: AbstractService<T>, endPoint: string) {
    this.service = service
    this.endPoint = endPoint
  }

  sendResponse (res: ResponseType, resp: Response) {
    const { code, value } = resp
    res.status(code).json(value)
  }

  public async post (req: RequestType, res: ResponseType, entity: T) {
    const added = {}
    added[pluralize.singular(this.endPoint)] = await this.service.upsert(entity)

    sendResponse(res, new Response(HttpStatus.OK, added))
  }

  public async get (req: RequestType, res: ResponseType, query: QueryType) {
    const result = {}
    result[pluralize.plural(this.endPoint)] = await this.service.find(query)
    result['count'] = await this.service.count(query)

    sendResponse(res, new Response(HttpStatus.OK, result))
  }

  public async getOne (req: RequestType, res: ResponseType, id: number) {
    const result = {}
    const value = await this.service.findById(id)
    result[pluralize.singular(this.endPoint)] = value

    if (value === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      sendResponse(res, new Response(HttpStatus.OK, result))
    }
  }

  public async patch (req: RequestType, res: ResponseType, id: number, body: T) {
    const result = await this.service.findById(id)
    if (result === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      const entity = Object.assign<T, T>(result, body)
      await this.service.upsert(entity)

      const data = {}
      data[pluralize.singular(this.endPoint)] = result

      sendResponse(res, new Response(HttpStatus.OK, data))
    }
  }

  public async delete (req: RequestType, res: ResponseType, id: number) {
    const result = await this.service.findById(id)

    if (result === undefined) {
      res.status(HttpStatus.NOT_FOUND).json()
    } else {
      await this.service.remove(result)
      const data = {}
      data[pluralize.singular(this.endPoint)] = result

      sendResponse(res, new Response(HttpStatus.OK, data))
    }
  }
}
