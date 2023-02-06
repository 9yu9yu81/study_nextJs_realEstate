import styled from '@emotion/styled'

export const colorZinc50 = '#FAFAFA'
export const colorZinc100 = '#F4F4F5'
export const colorZinc400 = '#a1a1a9'
export const colorZinc500 = '#717179'
export const colorZinc900 = '#27272A'

export const mainColor = colorZinc900
export const subColor_Dark = colorZinc500
export const subColor_medium = colorZinc400
export const subColor_light = colorZinc100
export const subColor_lighter = colorZinc50

export const Center_Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
export const Center2_Div = styled.div`
  display: flex;
  align-items: center;
`
export const CB = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${subColor_medium};
`
export const CBr = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${subColor_medium};
`
export const CBl = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid ${subColor_medium};
`
export const CBb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${subColor_medium};
`
export const CBt = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid ${subColor_medium};
`

export const B = styled.div`
  border: 1px solid ${subColor_medium};
`
export const Br = styled.div`
  border-right: 1px solid ${subColor_medium};
`
export const Bl = styled.div`
  border-left: 1px solid ${subColor_medium};
`
export const Bb = styled.div`
  border-bottom: 1px solid ${subColor_medium};
`
export const Bt = styled.div`
  border-top: 1px solid ${subColor_medium};
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

export const CBbstyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid ${mainColor};
  padding: 5px;
  font-size: 14px;
  font-weight: 400;
  color: dimgray;
`
export const Cstyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  font-size: 14px;
  font-weight: 400
  color: dimgray;
  `
