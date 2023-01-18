import { useState } from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Wishlist } from '@prisma/client'

const prisma = new PrismaClient()

//roomId 의 방을 몇명이 관심 목록에 등록 했는지를 업데이트하며 리턴한다
//todo 지금은 불필요한 api같음.. 후에 이를 사용하는 부분은 대체 후 삭제 요망
async function getRoomWished(roomId: string) {
  try {
    const wishlists: Wishlist[] = await prisma.wishlist.findMany({})
    let wished: number = 0
    wishlists.forEach(
      (wishlist) => wishlist.roomIds.split(',').includes(roomId) && wished++
    )

    const room = await prisma.room.update({
      where: {
        id: Number(roomId),
      },
      data: {
        wished: wished,
      },
    })

    return wished
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
    res.status(400).json({ message: 'no id' })
    return
  }
  try {
    const products = await getRoomWished(String(id))
    res.status(200).json({ items: products, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
