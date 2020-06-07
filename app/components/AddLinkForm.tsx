import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { clearClipboard, requestClipboard } from '../actions/userInterface'
import { RootState } from '../reducers'

const AddLinkInput = styled.input`
  width: 100%;
  border-bottom: 1px solid gray;
  font-size: 200%;
`

const isUrlValid = (url): boolean => url?.startsWith('http')

type AddLinkFormProps = {
  onSubmit: (url: string) => void
  onAbort: () => void
}

const AddLinkForm: React.FC<AddLinkFormProps> = ({ onSubmit, onAbort }) => {
  const dispatch = useDispatch()
  const { register, errors, handleSubmit } = useForm()

  useEffect(() => {
    dispatch(requestClipboard())
    return (): void => {
      dispatch(clearClipboard())
    }
  }, [dispatch])

  const clipboard = useSelector<RootState, string>(
    (state) => state.userInterface.clipboard,
  )
  if (isUrlValid(clipboard)) {
    // todo: display default
  }

  return (
    <div style={{ paddingTop: '20vh' }}>
      <form
        onSubmit={handleSubmit(({ uri }) => {
          onSubmit(uri)
        })}
      >
        <AddLinkInput
          name='url'
          autoFocus
          type='text'
          placeholder='URL here'
          ref={register({
            validate: (value) =>
              isUrlValid(value) ||
              'Did you forget the protocol? (e.g. https://)',
          })}
          onKeyDown={(event): void => {
            if (event.key === 'Escape') {
              onAbort()
            }
          }}
        />
        {errors.uri && (
          <div style={{ marginTop: '0.5em', color: 'darkred' }}>
            {errors.uri.message}
          </div>
        )}
      </form>
    </div>
  )
}

export default AddLinkForm
