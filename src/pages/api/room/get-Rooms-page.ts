import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getRooms({
  userId,
  skip,
  take,
}: {
  userId: string
  skip: number
  take: number
}) {
  try {
    const response = await prisma.room.findMany({
      skip: skip,
      take: take,
      where: {
        userId: userId,
      },
    })
    // console.log(response)
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
  const session = await getSession({ req })
  const { skip, take } = req.query

  if (session == null) {
    res.status(400).json({ message: 'no session' })
    return
  }
  if (skip == null) {
    res.status(400).json({ message: 'no skip' })
    return
  }
  if (take == null) {
    res.status(400).json({ message: 'no take' })
    return
  }

  try {
    const products = await getRooms({
      userId: String(session.user?.id),
      skip: Number(skip),
      take: Number(take),
    })
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
