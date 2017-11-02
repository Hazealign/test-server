import { Organization } from './OrganizationEntity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, OneToOne } from 'typeorm'
import { User } from './UserEntity'
import { Star } from './StarEntity'

// 그룹 공개 범위
export enum ProjectType {
  Personal = 'Personal', Internal = 'Internal', Public = 'Public'
}

export enum ProjectStatus {
  Proposal = 'Proposal', Progress = 'Progress', Closed = 'Closed'
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column('int')
  stage: number

  @Column('varchar', { length: '100' })
  type: ProjectType

  @OneToMany(type => Organization, org => org.id)
  @JoinColumn()
  organizations: Organization[]

  @OneToMany(type => User, user => user.id)
  @JoinColumn()
  users: User[]

  @OneToOne(type => User)
  owner: User

  @Column({ type: 'varchar', length: 'max' })
  description: string

  @Column({ type: 'varchar', length: 160 })
  shortDescription: string

  @OneToMany(type => Star, star => star.id)
  @JoinColumn()
  stars: Star[]

  @Column('varchar', { length: '100' })
  status: ProjectStatus
}
