import { useState } from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Wishlist } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoomWished(roomId: string) {
  try {
    const wishlists: Wishlist[] = await prisma.wishlist.findMany({})
    let wished: number = 0
    wishlists.forEach(
      (wishlist) => wishlist.roomIds.split(',').includes(roomId) && wished++
    )

    const room = await prisma.room.update({
      where: {
        id: Number(roomId),
      },
      data: {
        wished: wished,
      },
    })

    return wished
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
  const { id } = req.query

  if (id == null) {
    res.status(400).json({ message: 'no id' })
    return
  }
  try {
    const products = await getRoomWished(String(id))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
