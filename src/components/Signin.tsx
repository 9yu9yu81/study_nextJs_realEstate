import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@mantine/core'
import { IconLogin, IconLogout } from '@tabler/icons'

export default function SignIn() {
  const { data: session } = useSession()
  return (
    <div className="border-solid border-2 border-zinc-300 h-96 flex justify-center items-center">
      {session ? (
        <div>
          <Button
            variant="default"
            leftIcon={<IconLogout />}
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <div>
          <Button
            variant="default"
            leftIcon={<IconLogin />}
            onClick={() => signIn()}
          >
            Sign in with Google
          </Button>
        </div>
      )}
    </div>
  )
}
