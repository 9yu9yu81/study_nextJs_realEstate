import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoom(
  keyword: string,
  category_id: number,
  sType_id: number,
  orderBy: string
) {
  try {
    const validKeyword = `%${keyword}%`
    const validCategory = category_id === 0 ? '%' : category_id
    const validSType = sType_id === 0 ? '%' : sType_id

    const response: any = await prisma.$queryRaw`
      select r.*,
            s.type_id as sType_id, s.deposit, s.fee,
            a.name, a.doro, a.jibun, a.detail, a.lat, a.lng,
            b.supply_area, b.area, b.total_floor, b.floor, b.move_in, b.heat_id,
            m.maintenance_fee, m.maintenance_ids, m.elevator, m.parking, m.parking_fee, m.option_ids, m.structure_ids
            from Room as r, SaleInfo as s, AddressInfo as a, BasicInfo as b, MoreInfo as m
            where r.id=s.room_id 
              and r.id=a.room_id
              and r.id=b.room_id
              and r.id=m.room_id
              and r.status_id = 1
              and (a.doro like ${validKeyword} or a.jibun like ${validKeyword} or a.name like ${validKeyword})
              and r.category_id like ${validCategory}
              and s.type_id like ${validSType}`
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
  try {
    const { keyword, category_id, sType_id, orderBy } = req.query
    const items = await getRoom(
      String(keyword),
      Number(category_id),
      Number(sType_id),
      String(orderBy)
    )
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
