import { Button, Input } from '@mantine/core'
import { IconSearch, IconZoomIn } from '@tabler/icons'
import { useRouter } from 'next/router'

export default function Community() {
  //todo category 분류해서 contents 매핑해서 그리기
  //todo comment 개수 옆에 그리기
  //todo updateDate 맨 좌측에 그리기 (월/일)
  const router = useRouter()
  return (
    <>
      <div className="p-10 w-full">
        <Input icon={<IconSearch />} placeholder="검색" />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 text-sm text-zinc-500 gap-5">
        <div className=" border border-zinc-300 p-5 m-5">
          <div className="flex justify-center border-b mb-5 font-semibold text-lg">
            category
          </div>
          <div className="space-y-1 mb-5">
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
          <div className="flex border-t pt-2 text-xs">
            <Button
              onClick={() => router.push('/community/0')}
              className="ml-auto"
              variant="subtle"
              color={'gray'}
              leftIcon={<IconZoomIn size={20} />}
            >
              더 보기
            </Button>
          </div>
        </div>
        <div className=" border border-zinc-300 p-5 m-5">
          <div className="flex justify-center border-b mb-5 font-semibold text-lg">
            category
          </div>
          <div className="space-y-1 mb-5">
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
          <div className="flex border-t pt-2 text-xs">
            <Button
              onClick={() => router.push('/community/1')}
              className="ml-auto"
              variant="subtle"
              color={'gray'}
              leftIcon={<IconZoomIn size={20} />}
            >
              더 보기
            </Button>
          </div>
        </div>
        <div className=" border border-zinc-300 p-5 m-5">
          <div className="flex justify-center border-b mb-5 font-semibold text-lg">
            category
          </div>
          <div className="space-y-1 mb-5">
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
          <div className="flex border-t pt-2 text-xs">
            <Button
              onClick={() => router.push('/community/2')}
              className="ml-auto"
              variant="subtle"
              color={'gray'}
              leftIcon={<IconZoomIn size={20} />}
            >
              더 보기
            </Button>
          </div>
        </div>
        <div className=" border border-zinc-300 p-5 m-5">
          <div className="flex justify-center border-b mb-5 font-semibold text-lg">
            category
          </div>
          <div className="space-y-1 mb-5">
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
          <div className="flex border-t pt-2 text-xs">
            <Button
              onClick={() => router.push('/community/3')}
              className="ml-auto"
              variant="subtle"
              color={'gray'}
              leftIcon={<IconZoomIn size={20} />}
            >
              더 보기
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
