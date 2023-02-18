import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getIsWished(userId: string, roomId: number) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    })

    const wishlists = wishlist
      ? wishlist.roomIds.split(',').map((wishlist) => Number(wishlist))
      : []

    const isWished = wishlists.includes(roomId)
    console.log(isWished)
    return { isWished }
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
  const { roomId } = req.query

  if (session == null) {
    res.status(400).json({ message: 'no Session' })
    return
  }
  if (roomId == null) {
    res.status(400).json({ message: 'no roomId' })
  }
  try {
    const products = await getIsWished(String(session.user?.id), Number(roomId))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
