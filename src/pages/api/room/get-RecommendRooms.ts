import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getManagedRooms() {
  try {
    const response = await prisma.$queryRaw`
      select r.id, r.category_id, r.title, r.images,
            s.type_id as sType_id, s.deposit, s.fee,
            a.doro
            from Room as r, SaleInfo as s, AddressInfo as a
            where r.id=s.room_id
              and r.id=a.room_id
              and r.status_id = 1
            order by r.views desc
            limit 3`
    // const response = await prisma.$queryRaw`
    // select *
    //       from Room as r, SaleInfo as s, AddressInfo as a
    //       where r.id=s.room_id
    //         and r.id=a.room_id
    //         and r.status_id = 1
    //       order by r.views desc
    //       limit 3`
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
export default async function handler(_: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const items = await getManagedRooms()
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
