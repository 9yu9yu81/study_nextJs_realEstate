import { IconLogout, IconSearch, IconUser } from '@tabler/icons'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { Button, Menu } from '@mantine/core'

export default function Header() {
  //todo 유저 아이콘 클릭 => list (계약목록, 내가 게시한 매물, 로그아웃 ) 구현
  //todo 커뮤니티 (방구하기, 양도하기, 정보 스팟, 자유 스팟)
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <div className="bg-white  border-b border-zinc-400 p-3">
      <div className="w-full flex items-center">
        <Link href="/" className="flex">
          <Image
            className="mr-1"
            src="/../public/images/home.png"
            alt="logo"
            width={30}
            height={30}
          ></Image>
          <div className="text-sm text-zinc-600">MySpot</div>
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
        <Menu shadow="sm" width={150}>
          <Menu.Target>
            <Button variant="subtle" color="gray">
              커뮤니티
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => router.push('/community')}>
              전체 글
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/community/0')}>
              방 구하기
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/community/1')}>
              방 양도하기
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/community/2')}>
              정보 게시판
            </Menu.Item>
            <Menu.Item onClick={() => router.push('/community/3')}>
              자유 게시판
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<IconSearch size={15} />}>검색</Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
          <Menu shadow="sm" width={150}>
            <Menu.Target>
              <Image
                className="rounded-sm mr-3 ml-3"
                src={session.user?.image!}
                alt="profile"
                width={30}
                height={30}
              />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>내 방 목록</Menu.Item>
              <Menu.Item>내가 쓴 글</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                icon={<IconLogout size={15} />}
                onClick={() => signOut()}
              >
                로그아웃
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
