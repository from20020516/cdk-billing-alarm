import { SNSHandler } from 'aws-lambda'
import axios from 'axios'

/**
 * Send billing alarm to Discord Webhook.
 * @see https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/with-sns.html
 * @see https://discord.com/developers/docs/resources/webhook
 */
export const handler: SNSHandler = async (event) => {
    const message: ISNSMessage = JSON.parse(event.Records[0].Sns.Message)
    await axios.post(process.env.WEBHOOK_ENDPOINT!, {
        username: `AWS Billing Alarm (${message.AWSAccountId})`,
        content: message.NewStateReason
    })
}

interface ISNSMessage {
    AlarmName: string
    AlarmDescription?: any
    AWSAccountId: string
    NewStateValue: string
    NewStateReason: string
    StateChangeTime: Date
    Region: string
    AlarmArn: string
    OldStateValue: string
    Trigger: {
        MetricName: string
        Namespace: string
        StatisticType: string
        Statistic: string
        Unit?: any
        Dimensions: {
            value: string
            name: string
        }[]
        Period: number
        EvaluationPeriods: number
        ComparisonOperator: string
        Threshold: number
        TreatMissingData: string
        EvaluateLowSampleCountPercentile: string
    }
}
