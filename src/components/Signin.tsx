import { useSession, signIn } from 'next-auth/react'
import { Button } from '@mantine/core'
import { IconBrandGoogle } from '@tabler/icons'
import { Center_Div } from './styledComponent'

export default function SignIn() {
  const { status } = useSession()

  return (
    <Center_Div style={{ margin: '20vh 0 20vh 0 ' }}>
      {status === 'unauthenticated' && (
        <Center_Div
          style={{
            width: '400px',
            flexFlow: 'column',
            height: '450px',
            border: '0.5px solid black',
          }}
        >
          <div
            style={{
              fontWeight: '700',
              fontSize: '30px',
              margin: '0 0 80px 0',
              borderBottom: '0.5px solid black',
              padding: '0 40px 10px 40px',
            }}
          >
            로그인
          </div>
          <div className="font-bold mb-10" style={{ fontSize: '18px' }}>
            MySpot 서비스 이용을 위해 로그인 해주세요.
          </div>
          <Button
            variant="default"
            leftIcon={<IconBrandGoogle size={18} />}
            onClick={() => signIn('google')}
          >
            구글로 로그인
          </Button>
        </Center_Div>
      )}
    </Center_Div>
  )
}
