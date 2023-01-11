import Map from 'components/Map'
//todo 근데 지도에 방 데이터 받아서 마커 뿌릴려면 -> room에서  address 받아가지고 마커 뿌려주기 + 마커 클릭하면 ui 나오게도 구현해야함
export default function MainMap() {
  return (
    <div>
      <Map width="90vw" height="80vh" />
    </div>
  )
}
