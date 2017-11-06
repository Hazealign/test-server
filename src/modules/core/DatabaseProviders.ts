import { getConfiguration } from '../../utils/Configuration'
import { createConnection } from 'typeorm'

export const databaseProviders = [{
  provide: 'DbConnectionToken',
  useFactory: async () => await createConnection(getConfiguration().database)
}]
