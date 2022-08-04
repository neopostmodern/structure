import { pick } from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { TagObject } from '../reducers/links';
import colorTools from '../utils/colorTools';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import { TextField } from './CommonStyles';
import { NameInput } from './formComponents';

const ColorBlockInput = styled(TextField)`
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;

  text-align: center;
`;

const tagFormFields: Array<keyof TagObject> = [
  '_id',
  'updatedAt',
  'color',
  'name',
];
type TagInForm = Pick<TagObject, typeof tagFormFields[number]>;

interface TagFormProps {
  tag: TagObject;
  onSubmit: (tag: TagObject) => void;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSubmit }) => {
  const defaultValues = pick(tag, tagFormFields);

  const { register, getValues, handleSubmit } = useForm<TagInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      // todo: validate
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });

  useSaveOnUnmount({ onSubmit, defaultValues }, { getValues });

  const { ref: registerRef, ...registerProps } = register('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ColorBlockInput
        ref={(ref) => {
          registerRef(ref);
          colorTools(ref);
        }}
        {...registerProps}
        type="text"
        style={{ backgroundColor: tag.color }}
      />

      <NameInput type="text" {...register('name', { required: true })} />
    </form>
  );
};

export default TagForm;
