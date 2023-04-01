import { Pagination } from '@mantine/core'
import { mainColor } from './styledComponent'

export default function CustomPagination({
  page,
  total,
  onChange,
}: {
  page: number
  total: number
  onChange: any
}) {
  return (
    <Pagination
      page={page}
      color={'dark'}
      onChange={onChange}
      total={total}
      styles={() => ({
        item: {
          border: 0,
          color: `${mainColor} !important`,
          backgroundColor: 'white !important',
          fontWeight: 'lighter',
          '&[data-active]': {
            fontSize: '18px',
            fontWeight: 'normal',
          },
        },
      })}
    />
  )
}
