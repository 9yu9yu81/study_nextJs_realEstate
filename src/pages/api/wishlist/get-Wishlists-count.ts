import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

//todos wishlist 에만 동작하도록 수정해야함! 잘 못 짰음

async function getWishlistsCount(userId: string, category: string, ym: string) {
  const wishlist = await prisma.wishlist.findUnique({
    where: {
      userId: userId,
    },
  })

  const wishlists = wishlist?.roomIds
    .split(',')
    .map((wishlist) => Number(wishlist))

  const validCategory = category && category !== '-1' ? category : undefined
  const validYm = ym && ym !== '-1' ? ym : undefined

  try {
    if (wishlists && wishlists.length > 0) {
      const response = await prisma.room.count({
        where: {
          id: {
            in: wishlists,
          },
          categoryId: validCategory,
          ym: validYm,
        },
      })
      console.log(response)
      return response
    }
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getSession({ req })
  const { category, ym } = req.query

  if (session == null) {
    res.status(400).json({ message: 'no session' })
    return
  }

  try {
    const products = await getWishlistsCount(
      String(session.user?.id),
      String(category),
      String(ym)
    )
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
