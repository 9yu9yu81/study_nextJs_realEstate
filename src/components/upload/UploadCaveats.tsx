import styled from '@emotion/styled'
import { subColor_Dark, subColor_lighter } from 'components/styledComponent'

export default function UploadCaveat({
  manage,
  picture,
}: {
  manage?: boolean
  picture?: boolean
}) {
  return (
    <CaveatDiv>
      {picture ? (
        <>
          - 사진은 가로로 찍은 사진을 권장합니다.
          <br />- 사진 용량은 사진 한 장당 200KB 까지 등록 가능합니다.
          <br />- 사진은 최소 5장 이상 등록해야하며, 최대 10장까지 등록
          가능합니다.
        </>
      ) : (
        <>
          ∙ 전/월세 매물만 등록할 수 있습니다.
          <br />∙ 한 번에 1개의 매물만 등록 가능하며, 직거래로 표시됩니다.
          <br />∙ 등록한 매물은 30일 간 노출됩니다.
          {manage && (
            <>
              <br />∙ 공개중 : 내가 등록한 매물이 공개중인 상태
              <br />∙ 거래완료 : 등록한 매물이 거래완료된 상태
              <br />∙ 기한만료 : 등록한 매물의 30일 기한이 만료된 상태
            </>
          )}
        </>
      )}
    </CaveatDiv>
  )
}

const CaveatDiv = styled.div`
  color: ${subColor_Dark} !important;
  background-color: ${subColor_lighter};
  min-width: 990px;
  width: 990px;
  line-height: 2;
  font-size: 14px;
  padding: 20px;
  margin: 5px;
  display: flex;
  border-radius: 5px;
`
