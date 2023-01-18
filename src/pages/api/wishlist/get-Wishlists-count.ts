import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

//todos wishlist 에만 동작하도록 수정해야함! 잘 못 짰음

async function getWishlistsCount(category: string, ym: string) {
  const validCategory = category && category !== '-1' ? category : undefined
  const validYm = ym && ym !== '-1' ? ym : undefined

  try {
    const response = await prisma.room.count({
      where: {
        categoryId: validCategory,
        ym: validYm,
      },
    })
    console.log(response)
    return response
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
  const { category, ym } = req.query

  try {
    const products = await getWishlistsCount(String(category), String(ym))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
