import Link from 'next/link'
import { IconBrandInstagram } from '@tabler/icons'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'
import { mainColor } from './styledComponent'
import HomeLogo from './home/HomeLogo'

export default function Footer() {
  const router = useRouter()
  return (
    <Footer_Div>
      <div className="border-double border-t-2 border-zinc-400 p-4">
        <div className="flex space-x-3">
          <HomeLogo size={20} />
          <div className="flex items-center">
            <div className="pl-3 pr-3">
              <Link href="/introduce">사업소개</Link>
            </div>
            <div className="  border-l border-zinc-400 pl-3 pr-3">
              <Link href="/introduce">이용약관</Link>
            </div>
            <div className="  border-l border-zinc-400 pl-3 pr-3">
              <Link href="/introduce">개인정보처리방침</Link>
            </div>
            <div className="  border-l border-zinc-400 pl-3 pr-3">
              <Link href="/introduce">매물관리규정</Link>
            </div>
          </div>
        </div>
      </div>
      <div className=" border-t border-zinc-300 pt-6 pb-2 mr-2 ml-2 pl-2">
        MySpot
        <br />
        developer : 9yu9yu81
        <br />
        phone : 010-8593-0833
        <br />
        email : 9yu9yu81@gmail.com
        <br />
      </div>
      <div className="flex mt-4 mb-4 pl-4">
        <span>찾아주셔서 감사드립니다.</span>
        <IconBrandInstagram
          stroke={1.25}
          className="ml-auto mr-4"
          onClick={() => router.push('https://www.instagram.com/9yu9yu81/')}
        />
      </div>
    </Footer_Div>
  )
}

const Footer_Div = styled.div`
  min-width: 1000px;
  font-size: 14px;
  color: ${mainColor};
  font-weight: 300;
`
