import { IconUser } from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@mantine/core'

export default function Header() {
  //todo 유저 아이콘 클릭 => list (계약목록, 내가 게시한 매물, 로그아웃 ) 구현
  //todo 커뮤니티 (방구하기, 양도하기, 일반 게시판)
  const router = useRouter()
  const { data: session } = useSession()
  return (
    <div className="bg-white border-solid border-b border-zinc-400  p-2">
      <div className="w-full flex items-center">
        <Link href="/" className="flex">
          <Image
            className="mr-1"
            src="/../public/home.png"
            alt="logo"
            width={30}
            height={30}
          ></Image>
          <div className="text-sm text-zinc-700">MySpot</div>
        </Link>
        <span className="m-auto" />
        <Button
          variant="subtle"
          color="gray"
          onClick={() => router.push('/introduce')}
        >
          사업소개
        </Button>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => router.push('/mainMap')}
        >
          지도
        </Button>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => router.push('/comunity')}
        >
          커뮤니티
        </Button>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => router.push('/upload')}
        >
          방내놓기
        </Button>
        <Button
          variant="subtle"
          color="gray"
          onClick={() => router.push('/wishlist')}
        >
          관심목록
        </Button>{' '}
        {session ? (
          <Image
            className="rounded-sm mr-3 ml-3"
            src={session.user?.image!}
            alt="profile"
            width={30}
            height={30}
            onClick={() => router.push('/my')}
          />
        ) : (
          <Button
            variant="outline"
            color="gray"
            leftIcon={<IconUser />}
            onClick={() => router.push('/auth/login')}
          >
            로그인
          </Button>
        )}
      </div>
    </div>
  )
}
