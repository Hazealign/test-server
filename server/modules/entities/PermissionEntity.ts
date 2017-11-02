import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './UserEntity'

export enum PermissionType {
  User = 'User', LocalManager = 'LocalManager', CentralManager = 'CentralManager'
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: '100' })
  type: PermissionType

  @ManyToOne(type => User, user => user.id)
  user: User

  @Column('datetime')
  createdAt: Date
}
