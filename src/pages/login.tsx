import { Loader } from '@mantine/core'
import SignIn from 'components/Signin'
import { Center_Div } from 'components/styledComponent'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  const { status } = useSession()
  useEffect(() => {
    if (status === 'authenticated') {
      history.go(-2)
    }
  }, [status])
  return (
    <>
      {status === 'authenticated' || status === 'loading' ? (
        <Center_Div style={{ width: '1000px', margin: '200px 0 200px 0' }}>
          <Loader color="dark" />
        </Center_Div>
      ) : (
        <SignIn />
      )}
    </>
  )
}
