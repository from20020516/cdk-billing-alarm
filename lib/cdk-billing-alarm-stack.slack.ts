import { SNSHandler } from 'aws-lambda'
import { ISNSMessage } from '../bin/cdk-billing-alarm'
import axios from 'axios'

/**
 * Send billing alarm to Slack Webhook.
 * @see https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-sns.html
 * @see https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8
 */
export const handler: SNSHandler = async (event) => new Promise(async (resolve, reject) => {
    try {
        await Promise.all(event.Records.map(async (record) => {
            const { NewStateReason } = JSON.parse(record.Sns.Message) as ISNSMessage
            return axios.post(process.env.WEBHOOK_ENDPOINT!, {
                text: NewStateReason
            })
        }))
        resolve()
    } catch (error) {
        reject(error)
    }
})
