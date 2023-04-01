import { Checkbox } from '@mantine/core'
import { ChangeEventHandler, MouseEventHandler } from 'react'
import { subColor_medium } from './styledComponent'

export default function CustomCheckBox({
  label,
  onClick,
  checked,
  onChange,
}: {
  label: string
  onClick?: MouseEventHandler<HTMLInputElement>
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <Checkbox
      color="dark"
      label={label}
      checked={checked}
      onClick={onClick}
      onChange={onChange}
      styles={() => ({
        root: {
          display: 'flex',
          alignItems: 'center',
        },
        inner: {
          display: 'flex',
          alignItems: 'center',
        },
        input: {
          minWidth: '18px',
          minHeight: '18px',
          borderRadius: 0,
          border: `0.5px solid ${subColor_medium}`,
          backgroundColor: 'white !important',
        },
        icon: {
          color: 'black !important',
        },
      })}
    />
  )
}
