#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkBillingAlarmStack } from '../lib/cdk-billing-alarm-stack';

const app = new cdk.App();
new CdkBillingAlarmStack(app, 'CdkBillingAlarmStack', {
    env: {
        region: 'us-east-1'
    },
});
