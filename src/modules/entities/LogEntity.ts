import { Project } from './ProjectEntity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm'

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => Project, project => project.id)
  project: Project

  @Column({ type: 'varchar', length: 50 })
  message: string

  @Column('datetime')
  createdAt: Date
}
