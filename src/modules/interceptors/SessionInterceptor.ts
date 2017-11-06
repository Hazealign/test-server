import { NestInterceptor, ExecutionContext } from '@nestjs/common/interfaces'
import { Observable } from 'rxjs/Observable'

export class SessionInterceptor implements NestInterceptor {
  intercept ( dataOrRequest: any, context: ExecutionContext, stream$: Observable<any> ): Observable<any> | Promise<Observable<any>> {
    throw new Error('Method not implemented.')
  }
}
