import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoom(id: number) {
  try {
    const response: any = await prisma.$queryRaw`
      select r.*,
            s.type_id as sType_id, s.deposit, s.fee,
            a.doro, a.jibun, a.detail,
            b.supply_area, b.area, b.total_floor, b.floor, b.move_in, b.heat_id,
            m.maintenance_fee, m.maintenance_ids, m.elevator, m.parking, m.parking_fee, m.option_ids, m.structure_ids
            from Room as r, SaleInfo as s, AddressInfo as a, BasicInfo as b, MoreInfo as m
            where r.id=${id}
              and r.id=s.room_id
              and r.id=a.room_id
              and r.id=b.room_id
              and r.id=m.room_id
            limit 1`

    // const response: any = await prisma.$queryRaw`
    // select *
    //       from Room as r, SaleInfo as s, AddressInfo as a, BasicInfo as b, MoreInfo as m
    //       where r.id=${id}
    //         and r.id=s.room_id
    //         and r.id=a.room_id
    //         and r.id=b.room_id
    //         and r.id=m.room_id
    //       limit 1`
    console.log(response[0])
    return response[0]
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
    res.status(400).json({ message: 'no room_id' })
    return
  }
  try {
    const items = await getRoom(Number(id))
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
