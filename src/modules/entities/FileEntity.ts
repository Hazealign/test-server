import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm'
import { User } from './UserEntity'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @OneToOne(type => User)
  user: User

  @Column('bigint')
  size: number

  @Column({ type: 'varchar', length: 255 })
  name: string

  @Column({ type: 'varchar', length: 'max' })
  absolutePath: string

  @Column({ type: 'varchar', length: 'max' })
  originName: string
}
