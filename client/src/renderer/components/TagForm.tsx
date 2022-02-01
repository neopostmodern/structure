import { pick } from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { TagType } from '../types';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import { TextField } from './CommonStyles';
import { NameInput } from './formComponents';

const ColorBlockInput = styled(TextField)`
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;

  text-align: center;
  font-size: 0;
  cursor: pointer;

  &:focus {
    font-size: initial;
    cursor: initial;
  }
`;

const tagFormFields = ['_id', 'color', 'name'];

interface TagFormProps {
  tag: TagType;
  onSubmit: (tag: TagType) => void;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSubmit }) => {
  const defaultValues = pick(tag, tagFormFields);

  const { register, getValues } = useForm<
    Pick<TagType, typeof tagFormFields[number]>
  >({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      // todo: validate
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });

  useSaveOnUnmount({ onSubmit, defaultValues }, { getValues });

  return (
    <form>
      <ColorBlockInput
        {...register('color')}
        type="text"
        style={{ backgroundColor: tag.color }}
      />

      <NameInput type="text" {...register('name', { required: true })} />
    </form>
  );
};

export default TagForm;
