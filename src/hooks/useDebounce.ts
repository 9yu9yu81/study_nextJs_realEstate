import { useEffect, useState } from 'react'
const useDebounce = <T = any>(value: T, delay: number = 600) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(() => value)

  useEffect(() => {
    const Timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(Timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
