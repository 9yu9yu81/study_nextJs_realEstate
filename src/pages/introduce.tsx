import Image from 'next/image'

export default function Introduce() {
  return (
    <>
      <div className="relative" style={{ height: '600px' }}>
        <Image src="/../public/images/introRoom.png" fill alt="IntroRoom" />
      </div>
      <div className="text-zinc-700 font-thin m-10 leading-6">
        <div className="text-lg">안녕하세요 MySpot 입니다.</div>
        <div></div>
      </div>
    </>
  )
}
