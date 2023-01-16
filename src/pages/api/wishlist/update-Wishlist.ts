import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function updateWishlist(userId: string, roomId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId: userId,
      },
    })

    const oldWishlist =
      wishlist?.roomIds != null && wishlist.roomIds !== ''
        ? wishlist.roomIds.split(',')
        : []

    // roomId checking
    const isWished = oldWishlist.includes(roomId)
    // isWished ? delete : add
    const newWishlist = isWished
      ? oldWishlist.filter((id) => id !== roomId)
      : [...oldWishlist, roomId]

    const response = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {
        roomIds: newWishlist.join(','),
      },
      create: {
        userId,
        roomIds: newWishlist.join(','),
      },
    })

    // console.log(response)
    // return response?.roomIds.split(',')
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

  const roomId = JSON.parse(req.body)

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await updateWishlist(
      String(session.user.id),
      String(roomId)
    )
    res.status(200).json({ items: wishlist, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
