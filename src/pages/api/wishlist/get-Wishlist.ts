import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getWishlist(userId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    })

    const wishlists = wishlist?.roomIds
      .split(',')
      .map((wishlist) => Number(wishlist))

    if (wishlists && wishlists.length > 0) {
      const response = await prisma.room.findMany({
        where: {
          id: {
            in: wishlists,
          },
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

  if (session == null) {
    res.status(400).json({ message: 'no Session' })
    return
  }
  try {
    const products = await getWishlist(String(session.user?.id))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
