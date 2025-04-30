export async function notifySlack(message) {
  const response = await fetch(
    'https://hooks.slack.com/services/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',
    {
      method: 'POST',
      headers: {
        // "Content-Type": "application/json",
      },

      body: `{"blocks": [{ "type": "section", "text": {"type": "mrkdwn", "text": ${message} }}]}`,
    },
  )
}
