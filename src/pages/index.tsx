import { Button, Card, Input } from '@mantine/core'
import { IconSearch } from '@tabler/icons'
import { useState } from 'react'

export default function Home() {
  return (
    <div className="justify-center items-center text-zinc-500 mt-20">
      <div className="h-72 flex  border-b border-zinc-300">
        <div className="p-10 w-full space-y-5">
          <div className="h-16 text-3xl font-bold ">어떤 스팟을 찾으세요?</div>
          <Input icon={<IconSearch />} placeholder="지역을 입력하세요" />
        </div>
      </div>
      <div className="h-72 flex">
        <div className="p-6">
          <div className="h-12 font-semibold ">추천 스팟</div>
          <div className="flex space-x-1 text-sm">
            <Button
              size="xs"
              variant="outline"
              radius="xs"
              color="gray"
              onClick={() => {}}
            >
              전세
            </Button>
            <Button
              size="xs"
              variant="outline"
              radius="xs"
              color="gray"
              onClick={() => {}}
            >
              월세
            </Button>
            <Button
              size="xs"
              variant="outline"
              radius="xs"
              color="gray"
              onClick={() => {}}
            >
              원룸
            </Button>
            <Button
              size="xs"
              variant="outline"
              radius="xs"
              color="gray"
              onClick={() => {}}
            >
              투룸
            </Button>
            <Button
              size="xs"
              variant="outline"
              radius="xs"
              color="gray"
              onClick={() => {}}
            >
              쓰리룸
            </Button>
          </div>
        </div>
      </div>
      <div className="h-60 flex bg-zinc-100">
        <div className="p-5 w-full">
          <span className="text-sm">MySpot Analytics</span>
          <div className="grid grid-cols-3 h-40 space-x-5 mt-4">
            <Card shadow="sm" p="lg" radius="xs" withBorder>
              <Card.Section></Card.Section>
            </Card>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section></Card.Section>
            </Card>
            <Card shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section></Card.Section>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
