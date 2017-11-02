import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './UserEntity'
import { Project } from './ProjectEntity'

@Entity()
export class Star {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => User, user => user.stars)
  from: User

  @ManyToOne(type => Project, project => project.stars)
  to: Project

  @Column('datetime')
  createdAt: Date
}
