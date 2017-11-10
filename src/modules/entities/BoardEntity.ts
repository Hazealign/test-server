import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Project } from './ProjectEntity'

export enum BoardType {
    Organization = 'Organization',
    ProjectIssue = 'ProjectIssue',
    ProjectResource = 'ProjectResource',
    ProjectCohort = 'ProjectCohort',
    ProjectEstimate = 'ProjectEstimate',
    ProjectResultShare = 'ProjectResultShare',
    Admin = 'Admin'
}

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @Column('varchar', { length: '100' })
  type: BoardType

  @OneToOne(type => Project)
  project: Project

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'varchar', length: 'max' })
  description: string
}
