import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  //todo
  return (
    <div className="border-double border-t-2 border-zinc-600 p-10">
      <div className="grid grid-cols-3 justify-items-stretch text-zinc-600">
        <Link href="/" className="flex">
          <Image
            className="mr-1"
            src="/../public/home.png"
            alt="logo"
            width={30}
            height={30}
          ></Image>
          <div className="text-sm">MySpot</div>
        </Link>
        <div>list</div>
        <div>list</div>
      </div>
    </div>
  )
}
