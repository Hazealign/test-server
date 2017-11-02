import { Column, Entity, PrimaryGeneratedColumn, OneToOne, ManyToMany, OneToMany } from 'typeorm'
import { User } from './UserEntity'
import { File } from './FileEntity'
import { Board } from './BoardEntity'
import { Comment } from './CommentEntity'

export enum ArticleStatus {
    Open, Closed
}

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number

  @Column('datetime')
  createdAt: Date

  @OneToOne(type => User)
  user: User

  @Column('varchar', { length: 100 })
  title: string

  @Column('varchar', { length: 'max' })
  content: string

  @Column('simple-array')
  tags: string[]

  @Column('bigint')
  optionalId: number | null

  @Column('varchar', { length: '100' })
  status: ArticleStatus

  @OneToOne(type => Board)
  board: Board

  @OneToMany(type => Comment, comment => comment.id)
  comments: Comment[]

  @ManyToMany(type => File, file => file.id)
  files: File[]
}
