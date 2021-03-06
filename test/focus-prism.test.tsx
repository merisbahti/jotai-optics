import { atom, Provider, useAtom } from 'jotai'
import React from 'react'
import * as rtl from '@testing-library/react'
import { useFocus } from '../src/index'

it('updates prisms', async () => {
  const bigAtom = atom<{ a?: number }>({ a: 5 })

  const Counter: React.FC = () => {
    const aAtom = useFocus(bigAtom, optic => optic.prop('a').optional())
    const [count, setCount] = useAtom(aAtom)
    const [bigAtomValue] = useAtom(bigAtom)
    return (
      <>
        <div>bigAtom: {JSON.stringify(bigAtomValue)}</div>
        <div>count: {count}</div>
        <button onClick={() => setCount(c => c + 1)}>button</button>
      </>
    )
  }

  const { getByText, findByText } = rtl.render(
    <Provider>
      <Counter />
    </Provider>,
  )

  await findByText('count: 5')
  await findByText('bigAtom: {"a":5}')

  rtl.fireEvent.click(getByText('button'))
  await findByText('count: 6')
  await findByText('bigAtom: {"a":6}')
})

it('atoms that focus on no values are not updated', async () => {
  const bigAtom = atom<{ a?: number }>({})

  const Counter: React.FC = () => {
    const aAtom = useFocus(bigAtom, optic => optic.prop('a').optional())
    const [count, setCount] = useAtom(aAtom)
    const [bigAtomValue] = useAtom(bigAtom)
    return (
      <>
        <div>bigAtom: {JSON.stringify(bigAtomValue)}</div>
        <div>count: {JSON.stringify(count)}</div>
        <button onClick={() => setCount(c => c + 1)}>button</button>
      </>
    )
  }

  const { getByText, findByText } = rtl.render(
    <Provider>
      <Counter />
    </Provider>,
  )

  await findByText('count:')
  await findByText('bigAtom: {}')

  rtl.fireEvent.click(getByText('button'))
  await findByText('count:')
  await findByText('bigAtom: {}')
})
