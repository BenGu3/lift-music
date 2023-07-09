import { useState } from 'react'
import { isArray } from 'lodash'

export const useFIFOQueue = <T>(initial?: T[]): UseQueueReturn<T> => {
  const [queue, setQueue] = useState(initial ?? [])

  const front = (items: T | T[]) => setQueue(q => isArray(items) ? items.concat(q) : [items].concat(q))
  const back = (items: T | T[]) => setQueue(q => q.concat(items))
  const pop = () => {
    const first = queue[0]
    setQueue(q => q.slice(1))
    return first
  }
  const clear = () => setQueue([])

  return [
    queue,
    { front, back, pop, clear }
  ]
}

export const useLIFOQueue = <T>(initial?: T[]): UseQueueReturn<T> => {
  const [queue, setQueue] = useState(initial ?? [])

  const front = (items: T | T[]) => setQueue(q => q.concat(items))
  const back = (items: T | T[]) => setQueue(q => isArray(items) ? items.concat(q) : [items].concat(q))
  const pop = () => {
    const last = queue[queue.length - 1]
    setQueue(q => q.slice(0, queue.length - 1))
    return last
  }
  const clear = () => setQueue([])

  return [
    queue,
    { front, back, pop, clear }
  ]
}

type UseQueueReturn<T> = [
  queue: T[],
  actions: {
    front: (item: T | T[]) => void,
    back: (item: T | T[]) => void,
    pop: () => T,
    clear: () => void
  }
]
