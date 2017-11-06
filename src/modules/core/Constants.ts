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

    // Censoring Passwords
    if (this.value.hasOwnProperty('user')) {
      this.value['user']['password'] = undefined
    }

    if (this.value.hasOwnProperty('users')) {
      this.value['users'].forEach(element => {
        element['password'] = undefined
      })
    }
  }

  static catch (code: number): (Response) {
    const result = this.list.filter(resp => resp.code === code)
    if (result.length < 1) throw new Error('Code Not Found')
    else return result[0]
  }
}

export function sendResponse (resObj: ResponseType, resp: Response) {
  resObj.status(resp.code).json(resp.value)
}
