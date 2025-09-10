const { onRequest } = require('firebase-functions/v2/https')

exports.webhook = onRequest(async (req, res) => {
  try {
    const response = await fetch('https://privacyoff.com/v1/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body || {})
    })

    res.status(200).send(await response.json())
  } catch {
    res.status(500).send({ success: false })
  }
})
