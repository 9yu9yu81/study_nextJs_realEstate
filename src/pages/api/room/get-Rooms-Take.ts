import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getRoomsTake(
  keyword: string,
  category_id: number,
  sType_id: number,
  orderBy: string,
  sw: { lat: number; lng: number },
  ne: { lat: number; lng: number },
  take: number,
  skip: number
) {
  try {
    const validKeyword = keyword ? `%${keyword}%` : '%'
    const validCategory = category_id === 0 ? '%' : category_id
    const validSType = sType_id === 0 ? '%' : sType_id

    const validOrderBy =
      orderBy === 'latest'
        ? Prisma.sql`order by r.updatedAt desc`
        : orderBy === 'expensive'
        ? Prisma.sql`order by s.fee desc`
        : orderBy === 'cheap'
        ? Prisma.sql`order by s.fee`
        : orderBy === 'mostViewed'
        ? Prisma.sql`order by r.views desc`
        : Prisma.sql`order by r.wished desc`

    const response: any = await prisma.$queryRaw`
      select r.*,
        s.type_id as sType_id, s.deposit, s.fee,
        a.name, a.doro, a.lat, a.lng,
        b.area, b.move_in
        from Room as r, SaleInfo as s, AddressInfo as a, BasicInfo as b
        where r.id=s.room_id 
          and r.id=a.room_id
          and r.id=b.room_id
          and r.status_id = 1
          and (a.doro like ${validKeyword} or a.jibun like ${validKeyword} or a.name like ${validKeyword})
          and r.category_id like ${validCategory}
          and s.type_id like ${validSType}
          and (a.lat > ${sw.lat} and a.lat < ${ne.lat} and a.lng > ${sw.lng} and a.lng < ${ne.lng})
          ${validOrderBy}
          limit ${skip},${take}
      `

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
    const { keyword, category_id, sType_id, orderBy, s, w, e, n, take, skip } =
      req.query

    if (s === '0' || w === '0' || e === '0' || n === '0') {
      res.status(200).json({ items: [], message: 'no coords' })
      return
    }

    const items = await getRoomsTake(
      String(keyword),
      Number(category_id),
      Number(sType_id),
      String(orderBy),
      { lat: Number(s), lng: Number(w) },
      { lat: Number(n), lng: Number(e) },
      Number(take),
      Number(skip)
    )
    res.status(200).json({ items: items, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
