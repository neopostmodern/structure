import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormContext } from 'react-hook-form'
import styled from 'styled-components'

import urlAnalyzer from '../../../util/urlAnalyzer'
import { UserInterfaceStateType } from '../../reducers/userInterface'
import { RootState } from '../../reducers'

import { TextButton } from '../CommonStyles'
import { FormSubheader, NameInput } from '../formComponents'
import { clearMetadata, requestMetadata } from '../../actions/userInterface'

const Suggestions = styled.div<{ expanded: boolean }>`
  margin-bottom: 2rem;

  opacity: 0;
  max-height: 0;
  transition-property: all;
  transition-timing-function: ease-in-out;
  transition-duration: 0.3s;

  ${({ expanded }): string =>
    expanded
      ? `
  opacity: 1;
  max-height: 100px;`
      : ''}
`

const Suggestion = styled(TextButton)`
  margin-top: 1rem;

  &:focus,
  &:hover {
    outline: none;
    //text-decoration: underline;
    background-color: black;
    color: white;
  }
`

interface LinkNameFieldProps {
  url: string
  name: string
}

const LinkNameField: React.FC<LinkNameFieldProps> = ({ url, name }) => {
  const { watch, register, setValue } = useFormContext()
  const [nameFocused, setNameFocused] = useState(false)
  const [nameFocusedAnimation, setNameFocusedAnimation] = useState(false)
  const inputElement = useRef<HTMLInputElement>()

  const { metadata, metadataLoading } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface)

  const dispatch = useDispatch()

  useEffect(() => {
    return (): void => {
      dispatch(clearMetadata())
    }
  }, [])

  return (
    <>
      <NameInput
        type='text'
        name={name}
        autoFocus={watch(name) === urlAnalyzer(url).suggestedName}
        onFocus={(): void => {
          dispatch(requestMetadata(url))
          setNameFocused(true)
          setTimeout(() => setNameFocusedAnimation(true), 10)
        }}
        onBlur={(): void => {
          setNameFocusedAnimation(false)
          setTimeout(() => setNameFocused(false), 300)
        }}
        ref={(ref): void => {
          register(ref)
          inputElement.current = ref
        }}
        placeholder='Title'
      />
      {nameFocused && (
        <Suggestions expanded={nameFocusedAnimation}>
          <FormSubheader>Title suggestions</FormSubheader>
          {metadataLoading ? (
            <i>Loading metadata...</i>
          ) : (
            (metadata?.titles || []).map((title, index) => (
              <Suggestion
                type='button'
                style={{
                  fontStyle: 'italic',
                  fontSize: '80%',
                  display: 'block',
                  marginTop: '0.3em',
                }}
                key={index}
                onClick={(): void => {
                  inputElement.current.value = title
                  setValue(name, title, true)
                }}
              >
                {title}
              </Suggestion>
            ))
          )}
        </Suggestions>
      )}
    </>
  )
}

export default LinkNameField
