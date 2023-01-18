import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getWishlistPage(
  userId: string,
  skip: number,
  take: number,
  category: string,
  ym: string
) {
  try {
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

    if (wishlists && wishlists.length > 0) {
      const response = await prisma.room.findMany({
        skip: skip,
        take: take,
        where: {
          id: {
            in: wishlists,
          },
          categoryId: validCategory,
          ym: validYm,
        },
      })
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

  const { skip, take, category, ym } = req.query

  if (session == null) {
    res.status(400).json({ message: 'no session' })
    return
  }

  try {
    const products = await getWishlistPage(
      String(session.user?.id),
      Number(skip),
      Number(take),
      String(category),
      String(ym)
    )
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
