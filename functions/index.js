const { app } = require('./app')
const { randomBytes } = require('crypto')
const TelegramBot = require('node-telegram-bot-api')
const { onSchedule } = require('firebase-functions/scheduler')
const { getFirestore } = require('firebase-admin/firestore')
const { getSignedUrl } = require('./getSignedUrl')

const token = '8265205475:AAHVTiNIsCbJ9Rfos3r3BpmiXm5w5IX0d4g'
const botId = Number(token.split(':')[0])

const caption =
  '🚀 O MELHOR DO PRIVACY E ONLYFANS EM UM ÚNICO LUGAR 🚀\n' +
  '\n' +
  '💎 Tenha ACESSO TOTAL com apenas uma assinatura:\n' +
  '✨ Diversas modelos exclusivas\n' +
  '✨ Conteúdo de Privacy e OnlyFans reunido\n' +
  '✨ Packs + vídeos 🔥 SEM LIMITES\n' +
  '\n' +
  '💋 Um único acesso, tudo liberado pra você!\n' +
  '\n' +
  '🌐 Acesse o site: privacyoff.com\n' +
  '🌐 Acesse o grupo: t.me/privacyoffcom\n' +
  '\n' +
  '⚡️ Prazer ilimitado, conteúdo exclusivo e sem frescura! 😈🔥'

const reply_markup = {
  inline_keyboard: [
    [
      {
        url: 'https://privacyoff.com?ref=telegram',
        text: '🔞 Acessar conteúdo 🔥'
      },
      {
        url: 'https://t.me/privacyoffcom',
        text: '🔞 Acessar grupo 🔥'
      }
    ]
  ]
}

const db = getFirestore(app)

async function getMinUlid() {
  try {
    const snap = await db
      .collection('medias')
      .where('type', '==', 'video')
      .select('__name__')
      .orderBy('__name__')
      .limit(1)
      .get()

    return snap.docs[0].id
  } catch {
    return 0
  }
}

async function getMaxUlid() {
  try {
    const snap = await db
      .collection('medias')
      .where('type', '==', 'video')
      .select('__name__')
      .orderBy('__name__', 'desc')
      .limit(1)
      .get()

    return snap.docs[0].id
  } catch {
    return 0
  }
}

const BASE32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function ulidToBigInt(ulid) {
  let result = 0n
  for (const char of ulid) {
    result = result * 32n + BigInt(BASE32.indexOf(char))
  }
  return result
}

function bigIntToUlid(num) {
  let str = ''
  for (let i = 0; i < 26; i++) {
    str = BASE32[num % 32n] + str
    num /= 32n
  }
  return str
}

function randomBigIntBetween(min, max) {
  const range = max - min + 1n
  const rand = BigInt('0x' + randomBytes(16).toString('hex')) % range
  return min + rand
}

function randomULIDBetween(minUlid, maxUlid) {
  const minBig = ulidToBigInt(minUlid)
  const maxBig = ulidToBigInt(maxUlid)

  const randBig = randomBigIntBetween(minBig, maxBig)
  return bigIntToUlid(randBig)
}

const getRandomDoc = async () => {
  const minUlid = await getMinUlid()
  const maxUlid = await getMaxUlid()
  const randomUlid = randomULIDBetween(minUlid, maxUlid)

  let snap = await db
    .collection('medias')
    .where('type', '==', 'video')
    .where('__name__', '>=', randomUlid)
    .orderBy('__name__')
    .limit(1)
    .get()

  if (snap.empty) {
    snap = await db
      .collection('medias')
      .where('type', '==', 'video')
      .where('__name__', '<=', randomUlid)
      .orderBy('__name__', 'desc')
      .limit(1)
      .get()
  }

  return snap.empty ? null : snap.docs[0].data()
}

const downloadBuffer = async (content) => {
  try {
    const url = await getSignedUrl(content)
    const response = await fetch(url)

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
}

const getRandomVideo = async (onlyPreview = false) => {
  try {
    const { content, preview } = await getRandomDoc()

    return {
      preview: await downloadBuffer(preview),
      content: onlyPreview ? null : await downloadBuffer(content)
    }
  } catch {
    return null
  }
}

const startBotTrigger = async (bot, chatId) => {
  try {
    let messageId
    const { preview, content } = await getRandomVideo(true)

    try {
      try {
        const newMessage = await bot.sendVideo(
          chatId,
          content,
          { caption, reply_markup },
          { filename: 'video.mp4', contentType: 'video/mp4' }
        )

        messageId = newMessage.message_id
      } catch {
        const newMessage = await bot.sendAnimation(chatId, preview, { caption, reply_markup })

        messageId = newMessage.message_id
      }
    } catch {
      const newMessage = await bot.sendMessage(chatId, caption, { reply_markup })

      messageId = newMessage.message_id
    }

    if (messageId) {
      await bot.pinChatMessage(chatId, messageId)
    }

    return true
  } catch {
    return false
  }
}

const startBotGifTrigger = async (bot, chatId) => {
  try {
    try {
      const { preview } = await getRandomVideo(true)

      await bot.sendAnimation(chatId, preview, {
        caption,
        reply_markup
      })
    } catch {
      await bot.sendMessage(chatId, caption, { reply_markup })
    }

    return true
  } catch {
    return false
  }
}

const sentList = new Set()

exports.startBot = onSchedule(
  {
    cpu: 2,
    memory: '2GiB',
    schedule: 'every 5 minutes',
    timeZone: 'America/Sao_Paulo',
    timeoutSeconds: 240
  },
  async () => {
    try {
      const startDate = Math.floor(Date.now() / 1000)
      const bot = new TelegramBot(token, { polling: true })

      bot.on('message', async (msg) => {
        try {
          if (msg.date < startDate) return
          if (msg.from && msg.from.id === botId) return
          if (sentList.has(msg.chat.id)) return

          sentList.add(msg.chat.id)

          await startBotGifTrigger(bot, msg.chat.id)
        } catch {}
      })

      await startBotTrigger(bot, -1002670030493)
    } catch {}
  }
)
