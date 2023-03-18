import { useRouter } from 'next/router'
import { CHoverDiv, Center_Div, mainColor } from '../styledComponent'
import Image from 'next/image'

export default function HomeLogo({
  size,
  margin,
  onlyLogo = false,
}: {
  size: number
  margin?: number
  onlyLogo?: boolean
}) {
  const router = useRouter()
  return (
    <Center_Div
      style={{
        margin: `${margin}px`,
      }}
    >
      <CHoverDiv onClick={() => router.push('/')}>
        <Image
          className="mr-1"
          src="/icons/home.png"
          alt="home"
          width={size * 1.3}
          height={size * 1.3}
        />
        {onlyLogo ? (
          <></>
        ) : (
          <div style={{ fontSize: `${size}px`, color: `${mainColor}` }}>
            MySpot
          </div>
        )}
      </CHoverDiv>
    </Center_Div>
  )
}
