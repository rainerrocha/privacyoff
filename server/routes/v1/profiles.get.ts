export default defineEventHandler(async (event) => {
  const page = getQuery(event).page

  const items = [
    {
      id: crypto.randomUUID(),
      name: `${page} - Gaby Lopez`,
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    },
    {
      id: crypto.randomUUID(),
      name: `${page} - Mc Mirella`,
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    },
    {
      id: crypto.randomUUID(),
      name: `${page} - Karol Rosalin`,
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    },
    {
      id: crypto.randomUUID(),
      name: `${page} - Gaby Lopez`,
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    },
    {
      name: `${page} - Mc Mirella`,
      id: crypto.randomUUID(),
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    },
    {
      id: crypto.randomUUID(),
      name: `${page} - Karol Rosalin`,
      cover: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID(),
      avatar: 'https://i.pravatar.cc/300?u=' + crypto.randomUUID()
    }
  ]

  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    items,
    hasMore: Number(page) < 10,
    success: true
  }
})
