import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'
import { getOrderBy } from 'constants/const'

const prisma = new PrismaClient()

async function getRoomsPage(
  skip: number,
  take: number,
  category: string,
  ym: string,
  orderBy: string
) {
  const orderByCondition = getOrderBy(orderBy)

  try {
    const validCategory = category && category !== '-1' ? category : undefined
    const validYm = ym && ym !== '-1' ? ym : undefined

    const response = await prisma.room.findMany({
      skip: skip,
      take: take,
      where: {
        categoryId: validCategory,
        ym: validYm,
      },
      ...orderByCondition,
    })
    // console.log(response.map((res) => res.views))
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
  const { skip, take, category, ym, orderBy } = req.query

  try {
    const rooms = await getRoomsPage(
      Number(skip),
      Number(take),
      String(category),
      String(ym),
      String(orderBy)
    )
    res.status(200).json({ items: rooms, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
