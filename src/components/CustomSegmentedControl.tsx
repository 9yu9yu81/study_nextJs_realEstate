import { SegmentedControl } from '@mantine/core'
import { mainColor, subColor_lighter, subColor_medium } from './styledComponent'

export default function CustomSegmentedControl({
  value,
  onChange,
  data,
}: {
  value?: string
  onChange?: any
  data?: any
  margin?: number
  padding?: number
}) {
  return (
    <SegmentedControl
      value={value}
      onChange={onChange}
      color={'gray'}
      data={data}
      styles={() => ({
        root: {
          backgroundColor: 'white',
          padding: '10px',
        },
        label: {
          border: `0.5px solid ${subColor_medium}`,
          padding: '10px',
          paddingRight: '20px',
          paddingLeft: '20px',
          fontSize: '13px',
          color: `${mainColor}`,
          fontWeight: 'normal',
        },
        labelActive: {
          backgroundColor: `${mainColor}`,
          padding: '10px',
          paddingRight: '20px',
          paddingLeft: '20px',
          fontSize: '13px',
          color: `${subColor_lighter} !important`,
          fontWeight: 'normal',
        },
        control: {
          borderWidth: '0px !important',
          paddingRight: '10px',
          paddingLeft: '10px',
        },
        active: { backgroundColor: 'white', padding: '10px' },
      })}
      transitionDuration={0}
    />
  )
}
