const { app } = require('./app')
const { randomBytes } = require('crypto')
const TelegramBot = require('node-telegram-bot-api')
const { onSchedule } = require('firebase-functions/scheduler')
const { getFirestore } = require('firebase-admin/firestore')
const { getSignedUrl } = require('./getSignedUrl')
const { sample } = require('lodash-es')

const token = '8265205475:AAHVTiNIsCbJ9Rfos3r3BpmiXm5w5IX0d4g'
const botId = Number(token.split(':')[0])

const messages = [
  '🚀 O MELHOR DO PRIVACY E ONLYFANS EM UM ÚNICO LUGAR 🚀\n\n💎 Tenha acesso TOTAL com apenas uma assinatura:\n✨ Modelos exclusivas\n✨ Conteúdo Privacy + OnlyFans reunido\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Um único acesso, tudo liberado pra você!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Conteúdo exclusivo e prazer ilimitado! 😈🔥',
  '🔥 Descubra o universo Privacy e OnlyFans em um só lugar! 🔥\n\n💎 ACESSO TOTAL com apenas uma assinatura:\n✨ Diversas modelos exclusivas\n✨ Conteúdo completo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Tudo liberado para você!\n\n🌐 Acesse: privacyoff.com\n🌐 Grupo oficial: t.me/privacyoffcom\n\n⚡️ Conteúdo premium, sem frescura! 😈',
  '🚀 PrivacyOff: seu portal Privacy e OnlyFans 🚀\n\n💎 Assine e tenha:\n✨ Modelos exclusivas\n✨ Conteúdo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Tudo liberado em um único acesso!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Prazer ilimitado e exclusivo! 😈🔥',
  '💥 O MELHOR DO PRIVACY E ONLYFANS 💥\n\n💎 ACESSO TOTAL com uma assinatura:\n✨ Modelos incríveis\n✨ Conteúdo Privacy + OnlyFans reunido\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Liberte-se e aproveite tudo!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Conteúdo premium, sem limites! 😈',
  '🚀 Privacidade e entretenimento adulto juntos! 🚀\n\n💎 Tenha ACESSO TOTAL:\n✨ Diversas modelos exclusivas\n✨ Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Acesso único e completo!\n\n🌐 Acesse o site: privacyoff.com\n🌐 Grupo oficial: t.me/privacyoffcom\n\n⚡️ Conteúdo exclusivo e diversão garantida! 😈🔥',
  '🔥 PrivacyOff: Tudo Privacy + OnlyFans 🔥\n\n💎 Assinatura única:\n✨ Modelos exclusivas\n✨ Conteúdo completo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Tudo liberado em um único acesso!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Prazer sem limites! 😈',
  '🚀 O portal definitivo de Privacy e OnlyFans 🚀\n\n💎 Com apenas uma assinatura:\n✨ Modelos exclusivas\n✨ Conteúdo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Liberte seu acesso completo!\n\n🌐 privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Conteúdo adulto premium! 😈🔥',
  '💥 Tenha acesso total ao melhor do Privacy e OnlyFans 💥\n\n💎 Assine e aproveite:\n✨ Diversas modelos exclusivas\n✨ Conteúdo completo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Acesso liberado e único!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Prazer ilimitado e exclusivo! 😈',
  '🚀 PrivacyOff: Tudo que você quer em um só lugar 🚀\n\n💎 ACESSO TOTAL com uma assinatura:\n✨ Modelos exclusivas\n✨ Conteúdo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Tudo liberado para você!\n\n🌐 Acesse: privacyoff.com\n🌐 Grupo oficial: t.me/privacyoffcom\n\n⚡️ Conteúdo adulto premium e sem frescura! 😈🔥',
  '🔥 Explore o melhor do Privacy e OnlyFans 🔥\n\n💎 Tenha ACESSO TOTAL:\n✨ Modelos exclusivas\n✨ Conteúdo Privacy + OnlyFans\n✨ Packs + vídeos 🔥 SEM LIMITES\n\n💋 Liberte seu acesso completo!\n\n🌐 Site: privacyoff.com\n🌐 Grupo: t.me/privacyoffcom\n\n⚡️ Diversão e prazer ilimitados! 😈'
]

const caption = () => sample(messages)

const reply_markup = {
  inline_keyboard: [
    [
      {
        url: 'https://privacyoff.com?ref=telegram',
        text: '🔞 ACESSAR SITE 🔥🔥🔥'
      }
    ],
    [
      {
        url: 'https://t.me/privacyoffcom',
        text: '🔞 Entrar no grupo 🔥🔥🔥'
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
    const { preview, content } = await getRandomVideo()

    try {
      try {
        const newMessage = await bot.sendVideo(
          chatId,
          content,
          { caption: caption(), reply_markup },
          { filename: 'video.mp4', contentType: 'video/mp4' }
        )

        messageId = newMessage.message_id
      } catch {
        const newMessage = await bot.sendAnimation(chatId, preview, {
          caption: caption(),
          reply_markup
        })

        messageId = newMessage.message_id
      }
    } catch {
      const newMessage = await bot.sendMessage(chatId, caption(), { reply_markup })

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
        caption: caption(),
        reply_markup
      })
    } catch {
      await bot.sendMessage(chatId, caption(), { reply_markup })
    }

    return true
  } catch {
    return false
  }
}

const executeTrigger = async () => {
  try {
    const bot = new TelegramBot(token, { polling: true })

    await startBotTrigger(bot, -1002670030493)

    await new Promise((resolve) => {
      bot.on('message', async (msg) => {
        try {
          await startBotGifTrigger(bot, msg.chat.id)
        } catch (error) {
          console.error(error)
        }
      })

      bot.on('polling_error', async () => {
        await bot.stopPolling()
        resolve()
      })
    })
  } catch (error) {
    console.error(error)
  }
}

exports.startTelegramBot = onSchedule(
  {
    cpu: 1,
    memory: '2GiB',
    schedule: 'every 10 minutes',
    timeZone: 'America/Sao_Paulo',
    timeoutSeconds: 600
  },
  executeTrigger
)
