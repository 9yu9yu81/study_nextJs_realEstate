import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { getSession } from 'next-auth/react'

const prisma = new PrismaClient()

async function getWishlistsTake(
  user_id: string,
  skip: number,
  take: number,
  category_id: number,
  sType_id: number
) {
  try {
    const validCategory = category_id === 0 ? '%' : category_id
    const validSType = sType_id === 0 ? '%' : sType_id

    const response = await prisma.$queryRaw` 
      select r.id, r.category_id, r.images, r.title,
            s.type_id as sType_id, s.deposit, s.fee,
            a.doro
            from Room as r, SaleInfo as s, AddressInfo as a, Wishlist as w
            where r.id=s.room_id 
              and r.id=a.room_id
              and r.id=w.room_id
              and w.user_id=${user_id}
              and r.category_id like ${validCategory}
              and s.type_id like ${validSType}
              limit ${skip},${take}`
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
  if (session == null) {
    res.status(200).json({ items: undefined, message: 'no Session' })
    return
  }
  const { skip, take, category_id, sType_id } = req.query
  try {
    const items = await getWishlistsTake(
      String(session.user?.id),
      Number(skip),
      Number(take),
      Number(category_id),
      Number(sType_id)
    )
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
