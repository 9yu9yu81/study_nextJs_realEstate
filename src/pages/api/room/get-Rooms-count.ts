import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function getRoomsCount(category: string, ym: string, contains: string) {
  const validCategory = category && category !== '-1' ? category : undefined
  const validYm = ym && ym !== '-1' ? ym : undefined
  const containsCondition =
    contains && contains !== ''
      ? {
          address: { contains: contains },
        }
      : undefined
  try {
    const response = await prisma.room.count({
      where: {
        categoryId: validCategory,
        ym: validYm,
        ...containsCondition,
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
  const { category, ym, contains } = req.query

  try {
    const products = await getRoomsCount(
      String(category),
      String(ym),
      String(contains)
    )
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
