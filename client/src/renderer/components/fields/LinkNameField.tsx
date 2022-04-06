import { urlAnalyzer } from '@structure/common';
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearMetadata, requestMetadata } from '../../actions/userInterface';
import { RootState } from '../../reducers';
import { UserInterfaceStateType } from '../../reducers/userInterface';
import { FormSubheader, NameInput } from '../formComponents';

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
`;

const Suggestion = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  margin-top: 1rem;
  font: inherit;
  opacity: 0.75;
  cursor: pointer;

  &:focus,
  &:hover {
    opacity: 1;
    outline: none;
    //text-decoration: underline;
    background-color: ${({ theme }) => theme.palette.text.primary};
    color: ${({ theme }) => theme.palette.background.default};
  }
`;

interface LinkNameFieldProps {
  url: string;
  name: string;
}

const LinkNameField: React.FC<LinkNameFieldProps> = ({ url, name }) => {
  const { watch, register, setValue } = useFormContext();
  const [nameFocused, setNameFocused] = useState(false);
  const [nameFocusedAnimation, setNameFocusedAnimation] = useState(false);
  const inputElement = useRef<HTMLInputElement | null>();

  const { metadata, metadataLoading } = useSelector<
    RootState,
    UserInterfaceStateType
  >((state) => state.userInterface);

  const dispatch = useDispatch();

  useEffect(
    () => (): void => {
      dispatch(clearMetadata());
    },
    []
  );

  const formFieldProperties = register(name);

  return (
    <>
      <NameInput
        type="text"
        name={name}
        autoFocus={watch(name) === urlAnalyzer(url).suggestedName}
        onFocus={(): void => {
          dispatch(requestMetadata(url));
          setNameFocused(true);
          setTimeout(() => setNameFocusedAnimation(true), 10);
        }}
        onBlur={(event): void => {
          setNameFocusedAnimation(false);
          setTimeout(() => setNameFocused(false), 300);
          formFieldProperties.onBlur(event);
        }}
        onChange={formFieldProperties.onChange}
        ref={(ref): void => {
          formFieldProperties.ref(ref);
          inputElement.current = ref;
        }}
        placeholder="Title"
      />
      {nameFocused && (
        <Suggestions expanded={nameFocusedAnimation}>
          <FormSubheader>Title suggestions</FormSubheader>
          {metadataLoading ? (
            <i>Loading metadata...</i>
          ) : (
            (metadata?.titles || []).map((title, index) => (
              <Suggestion
                type="button"
                style={{
                  fontStyle: 'italic',
                  fontSize: '80%',
                  display: 'block',
                  marginTop: '0.3em',
                }}
                key={index}
                onClick={(): void => {
                  if (!inputElement.current) {
                    return;
                  }
                  inputElement.current.value = title;
                  setValue(name, title, {
                    shouldValidate: true,
                  });
                }}
              >
                {title}
              </Suggestion>
            ))
          )}
        </Suggestions>
      )}
    </>
  );
};

export default LinkNameField;
