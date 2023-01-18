import { SegmentedControl } from '@mantine/core'
import { subColor } from './styledComponent'

export default function CustomSegmentedControl({
  value,
  onChange,
  data,
}: {
  value: string
  onChange: any
  data: any
}) {
  return (
    <SegmentedControl
      value={value}
      onChange={onChange}
      color={'gray'}
      styles={(theme) => ({
        root: {
          backgroundColor: 'white',
        },
        label: {
          marginRight: 5,
          marginLeft: 5,
          backgroundColor: subColor,
        },
        labelActive: {
          marginRight: 5,
          marginLeft: 5,
          backgroundColor: '#52525B',
        },
        active: {
          marginRight: 5,
          marginLeft: 5,
        },
        control: { borderWidth: '0px !important' },
      })}
      transitionDuration={0}
      data={data}
    />
  )
}
