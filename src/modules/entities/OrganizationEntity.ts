import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

export enum OrganizationType {
    School = 'School', Pharmacy = 'Pharmarcy', Personal = 'Persaonal'
}

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { length: '100' })
  type: OrganizationType

  @Column({ type: 'varchar', length: 50 })
  name: string

  @Column({ type: 'varchar', length: 50 })
  mailDomain: string
}
