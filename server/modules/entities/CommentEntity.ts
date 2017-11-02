import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToOne, ManyToMany } from 'typeorm'
import { User } from './UserEntity'
import { File } from './FileEntity'
import { Article } from './ArticleEntity'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number
  @Column('datetime')
  createdAt: Date
  @OneToOne(type => User, user => user.id)
  user: User
  @Column('varchar', { length: 'max' })
  text: String
  @ManyToMany(type => File, file => file.id)
  files: File[]
  @ManyToOne(type => Article, article => article.id)
  article: Article
}
