import { IconLogout, IconSearch, IconUser } from '@tabler/icons'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Menu } from '@mantine/core'
import HomeLogo from './home/HomeLogo'
import {
  Center2_Div,
  HoverDiv,
  mainColor,
  subColor_lighter,
} from './styledComponent'
import styled from '@emotion/styled'

export default function Header() {
  //todo 유저 아이콘 클릭 => list (계약목록, 내가 게시한 매물, 로그아웃 ) 구현
  //todo 커뮤니티 (방구하기, 양도하기, 정보 스팟, 자유 스팟)
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <Header_Div>
      <HomeLogo size={20} />
      <span className="m-auto" />
      <Header_Btn_B onClick={() => router.push('/introduce')}>
        사업소개
      </Header_Btn_B>
      <Menu width={140}>
        <Menu.Target>
          <Header_Btn_B>커뮤니티</Header_Btn_B>
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
      <Header_Btn_B onClick={() => router.push('/mainMap')}>지도</Header_Btn_B>
      <Header_Btn_B
        onClick={() =>
          session ? router.push('/upload') : router.push('/auth/login')
        }
      >
        방내놓기
      </Header_Btn_B>
      <Header_Btn_B
        onClick={() =>
          session ? router.push('/wishlist') : router.push('/auth/login')
        }
      >
        관심목록
      </Header_Btn_B>
      {session ? (
        <Menu width={140}>
          <Menu.Target>
            <HoverDiv className="mr-3 ml-3">
              <Image
                src={session.user?.image!}
                alt="profile"
                width={24}
                height={24}
              />
            </HoverDiv>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => router.push('/upload?isManagePage=true')}>
              내 방 관리
            </Menu.Item>
            <Menu.Item>내가 쓴 글</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={() => signOut()}>
              <Center2_Div>
                <IconLogout size={15} className="mr-1" />
                로그아웃
              </Center2_Div>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Header_Btn_B onClick={() => router.push('/auth/login')}>
          <IconUser size={15} className="mr-1" />
          로그인
        </Header_Btn_B>
      )}
    </Header_Div>
  )
}

//Header
export const Header_Div = styled.div`
  min-width: 1000px;
  background-color: ${subColor_lighter};
  display: flex;
  align-items: center;
  padding: 18px;
  * {
    font-size: 15px;
    color: ${mainColor};
    background-color: ${subColor_lighter};
  }
`
export const Header_Btn_B = styled.button`
  width: 70px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`
