import { Entity, PrimaryGeneratedColumn, OneToOne, Column, ManyToOne } from 'typeorm'
import { Project } from './ProjectEntity'
import { User } from './UserEntity'

export enum InvitationType {
  Invitation = 'Invitation', JoinRequest = 'JoinRequest'
}

export enum InvitationStatus {
  Requested = 'Requested', Accepted = 'Accepted', Declined = 'Declined', Canceled = 'Canceled'
}

@Entity()
export class Invitation {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => Project, project => project.id)
  project: Project

  @Column('datetime')
  createdAt: Date

  @Column({ type: 'varchar', length: 255 })
  message: string

  @ManyToOne(type => User, user => user.id)
  requester: User

  @ManyToOne(type => User, user => user.id)
  approver: User | null

  @Column('varchar', { length: '100' })
  type: InvitationType

  @Column('varchar', { length: '100' })
  status: InvitationStatus

  @Column({ type: 'varchar', length: 255 })
  resultMsg: string | null

  @Column('datetime')
  expiredAt: Date
}
