import {
  Stack,
  StackProps,
  Duration,
  aws_cloudwatch as cw,
  aws_cloudwatch_actions as cwa,
  aws_sns as sns,
  aws_sns_subscriptions as snss,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class CdkBillingAlarmStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const { discord, slack } = this.node.tryGetContext('webhookUrls') ?? {}
    const email = this.node.tryGetContext('email')

    const billingTopic = new sns.Topic(this, 'BillingTopic')
    if (email) billingTopic.addSubscription(new snss.EmailSubscription(email))

    if (discord) {
      const handler = new NodejsFunction(this, 'discord', {
        environment: {
          WEBHOOK_ENDPOINT: discord
        }
      })
      billingTopic.addSubscription(new snss.LambdaSubscription(handler))
    }

    if (slack) {
      const handler = new NodejsFunction(this, 'slack', {
        environment: {
          WEBHOOK_ENDPOINT: slack
        }
      })
      billingTopic.addSubscription(new snss.LambdaSubscription(handler))
    }

    const alarmProps: cw.AlarmProps = {
      evaluationPeriods: 1,
      metric: new cw.Metric({
        namespace: 'AWS/Billing',
        metricName: 'EstimatedCharges',
        dimensionsMap: {
          Currency: 'USD',
        },
        statistic: 'Maximum',
        period: Duration.days(1),
        region: 'us-east-1',
      }),
      comparisonOperator: cw.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 0,
    }

    const makeBillingAlarm = (thresholdUsd: number, repeats: number) => {
      for (let i = 1; i < repeats + 1; i++) {
        new cw.Alarm(this, `BillingLv${i}Alarm`, { ...alarmProps, threshold: thresholdUsd * i })
          .addAlarmAction(new cwa.SnsAction(billingTopic))
      }
    }
    makeBillingAlarm(Number(this.node.tryGetContext('threshold') ?? 50), Number(this.node.tryGetContext('repeats') ?? 1))
  }
}
