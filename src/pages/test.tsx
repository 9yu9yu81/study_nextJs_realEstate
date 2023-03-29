import { FileButton } from '@mantine/core'
import { Center_Div } from 'components/styledComponent'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import filesToByte from 'hooks/filesToByte'
import { useMutation, useQuery } from '@tanstack/react-query'

export default function test() {
  const [files, setFiles] = useState<File[]>([])

  // const [images, setImages] = useState<number[][]>([])
  const [images, setImages] = useState<ArrayBuffer[]>([])
  // const [images, setImages] = useState<Blob[]>([])
  const handleConvert = () => {
    // files.map((f) => images.push(URL.createObjectURL(f)))
    console.log(images)
  }
  const handleOnLoad = () => {
    images.map((img) => console.log(img))
  }
  useEffect(() => {
    if (files.length === 0) return
    setImages(filesToByte(files))
  }, [files])

  const handleFilesChange = (nfiles: File[]) => {
    // setFiles((prev) => Array.from(new Set(prev.concat(nfiles)))) //중복제거 + 병합
    setFiles((prev) => prev.concat(nfiles))
  }
  const handleDelFiles = (file: File) => {
    // console.log(file.name)
    setFiles((prev) => prev.filter((f) => f !== file))
  }

  const { mutate: addTest } = useMutation<unknown, unknown, any, any>(
    (t) =>
      fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify(t),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onSuccess: async () => {},
    }
  )

  const { data: testImg } = useQuery<{ testImg: any }, unknown, any>(
    ['/api/get-Test'],
    () =>
      fetch('/api/get-Test')
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onSuccess: async () => {},
    }
  )

  const handleTest = () => {
    console.log(images[0])
    addTest(images[0])
  }

  return (
    <div>
      <Center_Div style={{ flexFlow: 'column' }}>
        <FileButton
          accept="image/*"
          multiple
          onChange={(e) => handleFilesChange(e)}
        >
          {(props) => (
            <button
              {...props}
              style={{
                height: '50px',
                width: '200px',
                color: 'white',
                backgroundColor: 'black',
                margin: '100px',
              }}
            >
              사진 추가하기
            </button>
          )}
        </FileButton>
        {files?.map((file, idx) => (
          <div
            key={idx}
            style={{ position: 'relative', width: '200px', height: '150px' }}
          >
            <Image fill alt="img" src={URL.createObjectURL(file)} />
            <Center_Div
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                color: 'white',
                backgroundColor: 'black',
                width: '20px',
                height: '20px',
              }}
            >
              <button onClick={() => handleDelFiles(file)}>X</button>
            </Center_Div>
          </div>
        ))}
        <button
          style={{
            height: '50px',
            width: '200px',
            color: 'white',
            backgroundColor: 'black',
            margin: '100px',
          }}
          onClick={() => files && handleConvert()}
        >
          convert
        </button>
        {/* {images.map((image, idx) => (
          <Image
            key={idx}
            alt="img"
            width={100}
            height={100}
            src={URL.createObjectURL(image)}
          ></Image>
        ))} */}
        {images.map((image, idx) => (
          <Image
            key={idx}
            alt="img"
            width={100}
            height={100}
            src={URL.createObjectURL(new Blob([image], { type: 'image/png' }))}
          ></Image>
        ))}
        {/* {images.map((image, idx) => (
          <Image
            key={idx}
            alt="img"
            width={100}
            height={100}
            src={URL.createObjectURL(new Blob(new ArrayBuffer(), { type: 'image/png' }))}
          ></Image>
        ))} */}
        {testImg && (
          <Image
            alt="img"
            width={100}
            height={100}
            src={URL.createObjectURL(
              new Blob([new ArrayBuffer(testImg)], { type: 'image/png' })
            )}
          ></Image>
        )}

        <button
          style={{
            height: '50px',
            width: '200px',
            color: 'white',
            backgroundColor: 'black',
            margin: '100px',
          }}
          onClick={() => handleTest()}
        >
          test
        </button>
        {/* <button
          style={{
            height: '50px',
            width: '200px',
            color: 'white',
            backgroundColor: 'black',
            margin: '100px',
          }}
          onClick={() => console.log(new Blob(testImg, { type: 'image/png' }))}
        >
          testImg
        </button> */}
      </Center_Div>
    </div>
  )
}
