import { Loader } from '@mantine/core'
import SignIn from 'components/Signin'
import { Center_Div } from 'components/styledComponent'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Login() {
  const { status } = useSession()
  useEffect(() => {
    if (
      status === 'authenticated' &&
      document.referrer &&
      document.referrer.indexOf('/') !== -1
    ) {
      history.go(-2) // 뒤로가기
    } else if (status === 'authenticated') {
      location.href = '/' // 메인페이지로
    }
  }, [status])
  return (
    <>
      {status === 'unauthenticated' ? (
        <SignIn />
      ) : (
        <Center_Div style={{ width: '1000px', margin: '400px 0 400px 0' }}>
          <Loader color="dark" />
        </Center_Div>
      )}
    </>
  )
}
