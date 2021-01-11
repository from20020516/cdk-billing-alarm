import * as cdk from '@aws-cdk/core'
import * as cloudwatch from '@aws-cdk/aws-cloudwatch'
import * as cloudwatchAlarm from '@aws-cdk/aws-cloudwatch-actions'
import * as sns from '@aws-cdk/aws-sns'
import * as snsSubscriptions from '@aws-cdk/aws-sns-subscriptions'

export class CdkBillingAlarmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const billingTopic = new sns.Topic(this, 'BillingTopic')
    billingTopic.addSubscription(new snsSubscriptions.EmailSubscription(this.node.tryGetContext('email')))

    new cloudwatch.Alarm(this, 'BillingAlarm', {
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 1,
      metric: new cloudwatch.Metric({
        metricName: 'EstimatedCharges',
        namespace: 'AWS/Billing',
        statistic: 'Maximum',
        dimensions: {
          Currency: 'JPY',
        },
      }).with({ period: cdk.Duration.hours(6) }),
      threshold: this.node.tryGetContext('threshold') ?? 5000
    }).addAlarmAction(new cloudwatchAlarm.SnsAction(billingTopic))
  }
}
