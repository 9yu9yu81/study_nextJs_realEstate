import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Room } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function updateContact(user_id: string, contact: string) {
  try {
    const response = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: { ...{ contact: contact } },
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
  const session = await getSession({ req })

  if (session == null) {
    res.status(400).json({ message: 'no Session' })
    return
  }

  const contact = JSON.parse(req.body)

  try {
    const items = await updateContact(String(session.user?.id), contact)
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'add-Room Failed' })
  }
}
