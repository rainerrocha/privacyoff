import { ulid } from 'ulid'
import { createHash } from 'crypto'

const deterministicPRNG = (entry: string) => {
  // Hash da string em bytes
  const hash = createHash('sha256').update(entry).digest()
  let i = 0

  // Retorna uma função que o ulid entende como PRNG
  return () => {
    // Pega 4 bytes de cada vez e transforma em número entre 0 e 1
    const value = ((hash[i] << 24) | (hash[i + 1] << 16) | (hash[i + 2] << 8) | hash[i + 3]) >>> 0
    i += 4
    if (i >= hash.length) i = 0 // loop no hash se necessário
    return value / 0xffffffff
  }
}

export const getId = (id?: number | string): string => {
  if (id) {
    const data = String(id)
    const hash = createHash('sha256').update(data).digest()

    // Deriva 48 bits (6 bytes) do hash para o timestamp
    const timestampBytes = Buffer.from(hash.subarray(0, 6))

    // Converte para número
    const timestamp = Number('0x' + timestampBytes.toString('hex').slice(0, 12))

    const prng = deterministicPRNG(data)

    return ulid(timestamp, prng)
  } else {
    return ulid()
  }
}
