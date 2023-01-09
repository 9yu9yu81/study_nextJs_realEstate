//id => category
//todo 카테고리에 맞는 글 뿌려주기
//todo pagination 구현

import { Button, Input } from '@mantine/core'
import { IconSearch, IconZoomIn } from '@tabler/icons'

export default function index() {
  return (
    <>
      <div className="p-10 w-full">
        <Input icon={<IconSearch />} placeholder="검색" />
      </div>
      <div className=" border border-zinc-300 p-10 m-5 text-zinc-600">
        <div className="flex justify-center border-b mb-5 p-2 font-bold text-2xl">
          category
        </div>
        <div className="space-y-3 mb-5">
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
          <div>test content</div>
        </div>
        <div className="flex border-t pt-2 text-sm">pagination</div>
      </div>
    </>
  )
}
