import { useRouter } from 'next/router'
import { CHoverDiv, Center_Div, mainColor } from '../styledComponent'
import Image from 'next/image'

export default function HomeLogo({
  size,
  margin,
}: {
  size: number
  margin?: number
}) {
  const router = useRouter()
  return (
    <Center_Div style={{ margin: `${margin}px` }}>
      <CHoverDiv onClick={() => router.push('/')}>
        <Image
          className="mr-1"
          src="/icons/home.png"
          alt="home"
          width={size * 1.3}
          height={size * 1.3}
        ></Image>
        <div style={{ fontSize: `${size}px`, color: `${mainColor}` }}>
          MySpot
        </div>
      </CHoverDiv>
    </Center_Div>
  )
}
