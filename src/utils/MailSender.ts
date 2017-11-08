import { getConfiguration } from './Configuration'
import * as nodemailer from 'nodemailer'
import { SentMessageInfo } from 'nodemailer'

export function sendMail (to: string, subject: string, value: string,
    isHtml: boolean = false): Promise<SentMessageInfo> {
  let transporter = nodemailer.createTransport(getConfiguration().email)
  let mailOptions = {
    from: '',
    to: to,
    subject: subject
  }

  mailOptions[isHtml ? 'html' : 'text'] = value
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) reject(error)
      resolve(info)
    })
  })
}
