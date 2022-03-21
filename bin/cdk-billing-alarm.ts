#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { CdkBillingAlarmStack } from '../lib/cdk-billing-alarm-stack'

const app = new cdk.App()
new CdkBillingAlarmStack(app, 'CdkBillingAlarmStack')

export interface ISNSMessage {
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
