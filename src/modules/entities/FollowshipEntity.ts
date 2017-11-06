import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './UserEntity'

@Entity()
export class Followship {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User, user => user.followings)
  from: User

  @ManyToOne(type => User, user => user.followers)
  to: User

  @Column('datetime')
  createdAt: Date
}
