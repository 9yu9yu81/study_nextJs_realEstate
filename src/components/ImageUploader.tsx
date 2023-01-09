import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, FileButton } from '@mantine/core'
export default function Products() {
  const [images, setImages] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  useEffect(() => {
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData()

        fd.append('image', files[i], files[i].name)
        fetch(
          'https://api.imgbb.com/1/upload?expiration=600&key=340eff97531848cc7ed74f9ea0a716de',
          { method: 'POST', body: fd }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data)

            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url)))
            )
          })
          .catch((error) => console.log(error))
      }
    }
  }, [files])

  return (
    <div className="m-5 p-5 bg-zinc-100" style={{ width: '950px' }}>
      <div className="mb-5">
        <FileButton accept="image/*" multiple onChange={setFiles}>
          {(props) => (
            <Button
              {...props}
              className="bg-zinc-600 text-zinc-100 ml-1"
              radius={'sm'}
              color={'gray'}
            >
              사진 추가하기
            </Button>
          )}
        </FileButton>
      </div>
      <div className="grid grid-cols-4 items-center space-y-2">
        {images &&
          images.length > 0 &&
          images.map((image, idx) => (
            <Image
              className="border border-zinc-400"
              alt={'img'}
              key={idx}
              src={image}
              width={200}
              height={200}
            />
          ))}
      </div>
    </div>
  )
}
