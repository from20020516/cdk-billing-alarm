# cdk-billing-alarm

AWS 請求アラーム

> $ npm run cdk deploy

- 通知先
  - メールアドレス
  - [Discord Webhook](https://discord.com/developers/docs/resources/webhook)
  - [Slack Incoming Webhook](https://slack.com/intl/ja-jp/help/articles/115005265063-Slack-%E3%81%A7%E3%81%AE-Incoming-Webhook-%E3%81%AE%E5%88%A9%E7%94%A8)
- `cdk.context.json`

```json
{
    "email": "...",
    "webhookUrls": {
        "slack": "https://hooks.slack.com/services/...",
        "discord": "https://discordapp.com/api/webhooks/..."
    },
    "threshold": "50", // Alarm閾値(USD)
    "repeats": "3" // 繰り返し回数 例: `threshold`が50で`repeats`が3の場合、$50, $100, $150で発火する
}
```
