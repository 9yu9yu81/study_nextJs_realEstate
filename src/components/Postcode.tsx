import { Button } from '@mantine/core'
import { useEffect, useRef } from 'react'

const id = 'daum-postcode' // script가 이미 rending 되어 있는지 확인하기 위한 ID
const src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'

export default function Postcode() {
  const postcodeRef = useRef<HTMLDivElement>(null)
  const loadLayout = () => {
    window.daum.postcode.load(() => {
      const postcode = new window.daum.Postcode({
        oncomplete: function (data: any) {
          console.log(data)
        },
      })
      postcode.open()
    })
  }

  useEffect(() => {
    const isAlready = document.getElementById(id)

    if (!isAlready) {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      document.body.append(script)
    }
  }, [])

  return (
    <>
      <Button
        className="bg-zinc-600 text-zinc-100 ml-1"
        radius={'sm'}
        color={'gray'}
        onClick={loadLayout}
      >
        주소 검색
      </Button>
      <div ref={postcodeRef}></div>
    </>
  )
}
