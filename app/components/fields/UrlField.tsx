import React from 'react'
import { useFormContext } from 'react-hook-form'

import { InlineButton } from '../CommonStyles'

interface UrlFieldProps {
  name: string
}

const UrlField: React.FC<UrlFieldProps> = ({ name }) => {
  const { watch, register } = useFormContext()

  return (
    <div style={{ display: 'flex' }}>
      <input type='text' name={name} ref={register} />
      <InlineButton
        type='button'
        style={{ marginLeft: '1rem' }}
        onClick={(): void => {
          window.open(watch(name), '_blank', 'noopener, noreferrer')
        }}
      >
        Open
      </InlineButton>
    </div>
  )
}

export default UrlField
