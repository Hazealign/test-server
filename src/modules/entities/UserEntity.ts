import * as argon2 from 'argon2'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm'
import { Followship } from './FollowshipEntity'
import { Star } from './StarEntity'
import { Permission } from './PermissionEntity'
import { Organization } from './OrganizationEntity'

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
  emailConfirmed: boolean = false

  @Column()
  approved: boolean = false

  @Column({ type: 'varchar', length: 50 })
  password: string

  @Column({ type: 'varchar', length: 10 })
  signKey: string | null

  @Column({ type: 'varchar', length: 'max' })
  profileImage: string

  @OneToOne(type => Organization)
  organization: Organization

  @OneToMany(type => Permission, permission => permission.user)
  @JoinColumn()
  permissions: Permission[]

  @OneToMany(type => Followship, following => following.from)
  @JoinColumn()
  followings: Followship[]

  @OneToMany(type => Followship, follower => follower.to)
  @JoinColumn()
  followers: Followship[]

  @OneToMany(type => Star, star => star.from)
  @JoinColumn()
  stars: Star[]

  public async setPassword (newPassword: string) {
    try {
      const hash = await argon2.hash(newPassword, {
        timeCost: 4, memoryCost: 13, parallelism: 2, type: argon2.argon2d
      })
      this.password = hash
    } catch (exception) {
      throw new Error('Argon2: ' + exception)
    }
  }
}
