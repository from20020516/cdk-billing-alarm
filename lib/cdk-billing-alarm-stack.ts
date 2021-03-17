import * as cdk from '@aws-cdk/core'
import * as cloudwatch from '@aws-cdk/aws-cloudwatch'
import * as cloudwatchAlarm from '@aws-cdk/aws-cloudwatch-actions'
import * as lambda from '@aws-cdk/aws-lambda-nodejs'
import * as sns from '@aws-cdk/aws-sns'
import * as snsSubscriptions from '@aws-cdk/aws-sns-subscriptions'

export class CdkBillingAlarmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const billingTopic = new sns.Topic(this, 'BillingTopic')
    this.node.tryGetContext('email') && billingTopic.addSubscription(new snsSubscriptions.EmailSubscription(this.node.tryGetContext('email')))
    this.node.tryGetContext('discord') && billingTopic.addSubscription(new snsSubscriptions.LambdaSubscription(
      new lambda.NodejsFunction(this, 'discord', {
        environment: {
          WEBHOOK_ENDPOINT: this.node.tryGetContext('discord')
        }
      })))

    new cloudwatch.Alarm(this, 'BillingAlarm', {
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: new cloudwatch.Metric({
        metricName: 'EstimatedCharges',
        namespace: 'AWS/Billing',
        statistic: 'Maximum',
        dimensions: {
          Currency: 'USD',
        },
      }).with({ period: cdk.Duration.hours(6) }),
      threshold: Number(this.node.tryGetContext('threshold')) || 50
    }).addAlarmAction(new cloudwatchAlarm.SnsAction(billingTopic))
  }
}
