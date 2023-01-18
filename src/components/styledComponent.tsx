import styled from '@emotion/styled'

export const colorZinc400 = '#a1a1a9'
export const mainColor = colorZinc400
export const subColor = '#F6F6F6'

export const CenteringDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const Cb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${mainColor};
`
export const Cbr = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${mainColor};
`
export const Cbl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid ${mainColor};
`
export const Cbb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${mainColor};
`
export const Cbt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${mainColor};
`

export const B = styled.div`
  border: 1px solid ${mainColor};
`
export const Br = styled.div`
  border-right: 1px solid ${mainColor};
`
export const Bl = styled.div`
  border-left: 1px solid ${mainColor};
`
export const Bb = styled.div`
  border-bottom: 1px solid ${mainColor};
`
export const Bt = styled.div`
  border-top: 1px solid ${mainColor};
`

export const StyledImage = styled.div`
  position: relative;
  overflow: hidden;
  .styled {
    transform: scale(1);
    transition: all 0.3s;
    :hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }
`
export const HoverDiv = styled.div`
  :hover {
    cursor: pointer;
  }
`
export const CHoverDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`

export const CBstyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${mainColor};
  padding: 5px;
  font-size: 14px;
  font-weight: 400;
  color: dimgray;
`