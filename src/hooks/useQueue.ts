import { useState } from 'react'

export const useQueue = <T>(initial?: T[]): UseQueueReturn<T> => {
  const [queue, setQueue] = useState(initial ?? [])

  const push = (items: T | T[]) => setQueue(q => q.concat(items))
  const pop = () => {
    const top = queue[0]
    setQueue(q => q.slice(1))
    return top
  }
  const clear = () => setQueue([])

  return [
    queue,
    { push, pop, clear }
  ]
}

type UseQueueReturn<T> = [
  queue: T[],
  actions: {
    push: (item: T | T[]) => void,
    pop: () => T,
    clear: () => void
  }
]
