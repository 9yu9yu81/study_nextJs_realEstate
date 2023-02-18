import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function updateIsWished(user_id: string, room_id: number) {
  try {
    const response: any = await prisma.$queryRaw`
      select exists (select * from Wishlist as w where w.user_id = ${user_id} and w.room_id = ${room_id}) as isWished
    `
    const isWished: boolean = Boolean(response[0].isWished)

    isWished
      ? await prisma.$queryRaw`
      delete w.* from Wishlist as w where w.user_id=${user_id} and w.room_id=${room_id}
    `
      : await prisma.$queryRaw`
      insert into Wishlist (user_id, room_id) values (${user_id}, ${room_id})
    `
    isWished
      ? await prisma.$queryRaw`
      update Room set wished = wished - 1 where id = ${room_id}`
      : await prisma.$queryRaw`
      update Room set wished = wished + 1 where id = ${room_id}`

    return
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

  const room_id = JSON.parse(req.body)

  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await updateIsWished(
      String(session.user.id),
      Number(room_id)
    )
    res.status(200).json({ items: wishlist, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
