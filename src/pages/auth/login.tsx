import { Loader } from '@mantine/core'
import SignIn from 'components/Signin'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export default function Login() {
  const { status } = useSession()
  useEffect(() => {
    if (status === 'authenticated') {
      history.go(-2)
    }
  })
  return (
    <>
      {status === 'authenticated' || status === 'loading' ? (
        <Loader color="dark" />
      ) : (
        <SignIn />
      )}
    </>
  )
}
