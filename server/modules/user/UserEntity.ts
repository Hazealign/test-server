import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @Column('date')
  approvedAt: Date | null

  @Column({ type: 'varchar', length: 20 })
  name: string

  @Column({ type: 'varchar', length: 50 })
  email: string

  @Column()
  approved: boolean

  @Column({ type: 'varchar', length: 50 })
  password: string

  @Column({ type: 'varchar', length: 10 })
  signKey: string | null

  @Column({ type: 'varchar', length: 'max' })
  profileImage: string
}
