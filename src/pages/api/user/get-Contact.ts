import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getContact(user_id: string) {
  try {
    const response = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    })

    if (response?.contact === null) {
      return ''
    } else {
      return response?.contact
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
    res.status(200).json({ message: 'no Session' })
    return
  }

  try {
    const products = await getContact(String(session.user?.id))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
