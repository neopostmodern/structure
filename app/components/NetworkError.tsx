import React from 'react'
import styled from 'styled-components'
import { ApolloError } from '@apollo/client'

const ErrorContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const ReloadButton = styled.button`
  width: 10em;
  height: 3em;
  margin-top: 1em;
`

const ErrorInformation = styled.div`
  align-self: flex-start;
  color: gray;
  margin-top: 5em;
`

interface NetworkErrorProps {
  error: ApolloError // todo: could be more generic?
  refetch: () => void
}

const NetworkError: React.FC<NetworkErrorProps> = ({ error, refetch }) => {
  let fullErrorMessage
  try {
    fullErrorMessage = <pre>{JSON.stringify(error, null, 2)}</pre>
  } catch (e) {
    fullErrorMessage = (
      <div>Complete error message couldn&apos;t be displayed.</div>
    )
  }
  return (
    <ErrorContainer>
      <h1>Network error.</h1>
      <ReloadButton type='button' onClick={refetch} autoFocus>
        Reload
      </ReloadButton>
      <ErrorInformation>
        <h3>Further information</h3>
        <div>{error.message}</div>
        {fullErrorMessage}
      </ErrorInformation>
    </ErrorContainer>
  )
}

export default NetworkError
