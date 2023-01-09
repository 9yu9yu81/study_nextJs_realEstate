import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@mantine/core'
import { IconBrandGoogle, IconLogout } from '@tabler/icons'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function SignIn() {
  const { data: session } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session) {
      router.push('/')
    }
  })
  return (
    <div className="h-96 w-96 m-auto flex justify-center items-center  border border-zinc-200">
      {!session && (
        <div>
          <div className="font-bold text-3xl mb-10 pb-7  border-b border-zinc-200">
            로그인
          </div>
          <div className="font-bold text-xs mb-10">
            MySpot 서비스 이용을 위해 로그인 해주세요.
          </div>
          <Button
            variant="default"
            leftIcon={<IconBrandGoogle size={18} />}
            onClick={() => signIn()}
          >
            구글로 로그인
          </Button>
        </div>
      )}
    </div>
  )
}

