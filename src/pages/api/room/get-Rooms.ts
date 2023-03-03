import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoom() {
  try {
    const response: any = await prisma.$queryRaw`
      select r.*,
            s.type_id as sType_id, s.deposit, s.fee,
            a.doro, a.jibun, a.detail, a.lat, a.lng,
            b.supply_area, b.area, b.total_floor, b.floor, b.move_in, b.heat_id,
            m.maintenance_fee, m.maintenance_ids, m.elevator, m.parking, m.parking_fee, m.option_ids, m.structure_ids
            from Room as r, SaleInfo as s, AddressInfo as a, BasicInfo as b, MoreInfo as m
            where r.id=s.room_id 
              and r.id=a.room_id
              and r.id=b.room_id
              and r.id=m.room_id
              and r.status_id = 1`
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
  try {
    const items = await getRoom()
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
