import { Response as ResponseType } from 'express'

export class Response {
  static list: Response[] = [
    new Response(400, { error: 'BAD_REQUEST' }),
    new Response(401, { error: 'UNAUTHORIZED' }),
    new Response(403, { error: 'FORBIDDEN_REQUEST' }),
    new Response(404, { error: 'NOT_FOUND' }),
    new Response(500, { error: 'INTERNAL_ERROR' })
  ]
  code: number
  value: any

  constructor (code: number, value: any, ex?: Error) {
    this.code = code
    this.value = value
    if (ex !== undefined) this.value['exception'] = ex.message
  }

  static catch (code: number): (Response | undefined) {
    const result = this.list.filter(resp => resp.code === code)
    if (result.length < 1) return undefined
    else return result[0]
  }
}

export function sendResponse (resObj: ResponseType, resp: Response) {
  resObj.status(resp.code).json(resp.value)
}
