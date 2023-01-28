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
  // justify-content: center;
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

export const CaveatDiv = styled.div`
  color: ${subColor_Dark};
  background-color: ${subColor_lighter};
  width: 100%;
  line-height: 2;
  font-size: 14px;
  padding: 20px;
  margin-top: 30px;
  display: flex;
  border-radius: 5px;
`

//Upload Page
export const Upload_Btn_Dark = styled.button`
  color: ${subColor_lighter};
  background-color: ${mainColor};
  border: 0.5px solid ${subColor_lighter};
  width: 50%;
  height: 60px;
  font-size: 15px;
`

export const Upload_Btn_Bright = styled.button`
  color: ${mainColor};
  background-color: ${subColor_lighter};
  border: 0.5px solid ${subColor_lighter};
  width: 50%;
  height: 60px;
  font-size: 15px;
`

export const Upload_Btn_Submit = styled.button`
  color: ${subColor_lighter};
  background-color: ${mainColor};
  width: 100px;
  height: 40px;
  font-size: 14px;
`

export const Upload_Div_B = styled.div`
  border: 0.5px solid ${subColor_medium};
  margin-top: 30px;
`

export const Upload_Div_Absolute = styled.div`
  font-size: 12px;
  position: absolute;
  right: 10px;
  top: 25px;
  color: ${subColor_medium};
`

export const Upload_Div_Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  padding: 20px;
  width: 100%;
  border-bottom: 0.5px solid ${subColor_medium};
`
export const Upload_Div_Sub_Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  font-size: 15px;
  background-color: ${subColor_lighter};
`

export const Upload_Div_Bt = styled.div`
  width: 100%;
  display: flex;
  font-size: 15px;
  border-top: 1px solid ${subColor_light};
`
export const Upload_Div_Sub = styled.div`
  padding: 40px;
  display: flex;
  align-items: center;
  color: ${subColor_Dark};
`

//Header
export const Header_Div = styled.div`
  background-color: ${subColor_lighter};
  display: flex;
  align-items: center;
  padding: 20px;
  * {
    font-size: 12.5px;
    color: ${mainColor};
    background-color: ${subColor_lighter};
  }
`
export const Header_Btn_B = styled.button`
  font-size: 14px;
  width: 70px;
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`
