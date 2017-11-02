import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { Followship } from './FollowshipEntity'
import { Star } from './StarEntity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @Column('datetime')
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

  @OneToMany(type => Followship, following => following.from)
  @JoinColumn()
  followings: Followship[]

  @OneToMany(type => Followship, follower => follower.to)
  @JoinColumn()
  followers: Followship[]

  @OneToMany(type => Star, star => star.from)
  @JoinColumn()
  stars: Star[]
}
