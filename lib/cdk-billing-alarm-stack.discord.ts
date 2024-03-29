import { SNSHandler } from 'aws-lambda'
import { ISNSMessage } from '../bin/cdk-billing-alarm'
import axios from 'axios'

/**
 * Send billing alarm to Discord Webhook.
 * @see https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-sns.html
 * @see https://discord.com/developers/docs/resources/webhook
 */
export const handler: SNSHandler = async (event) => new Promise(async (resolve, reject) => {
    try {
        await Promise.all(event.Records.map(async (record) => {
            const { AWSAccountId, NewStateReason } = JSON.parse(record.Sns.Message) as ISNSMessage
            return axios.post(process.env.WEBHOOK_ENDPOINT!, {
                username: `AWS Billing Alarm (${AWSAccountId})`,
                content: NewStateReason
            })
        }))
        resolve()
    } catch (error) {
        reject(error)
    }
})
