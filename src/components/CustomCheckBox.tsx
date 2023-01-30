import { Checkbox } from '@mantine/core'
import { ChangeEventHandler, MouseEventHandler, useState } from 'react'
import { subColor_medium } from './styledComponent'

export default function CustomCheckBox({
  label,
  onclick,
  checked,
  onChange,
}: {
  label: string
  onclick?: MouseEventHandler<HTMLInputElement>
  checked?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <Checkbox
      color={'dark'}
      label={label}
      onClick={onclick}
      checked={checked}
      onChange={onChange}
      styles={(theme) => ({
        root: { display: 'flex', alignItems: 'center' },
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
      })}
    />
  )
}
