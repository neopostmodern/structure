import { pick } from 'lodash';
import React from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { TagsQuery } from '../generated/graphql';
import useSyncForm from '../hooks/useSyncForm';
import colorTools from '../utils/colorTools';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import { TextField } from './CommonStyles';
import { NameInput } from './formComponents';

type TagType = TagsQuery['tags'][number];

const ColorBlockInput = styled(TextField)`
  width: 10rem;
  height: 10rem;
  margin-bottom: 2rem;

  text-align: center;
`;

const tagFormFields: Array<keyof TagType> = [
  '_id',
  'updatedAt',
  'color',
  'name',
];
export type TagInForm = Pick<TagType, typeof tagFormFields[number]>;

interface TagFormProps {
  tag: TagType;
  onSubmit: (tag: TagInForm) => void;
}

const TagForm: React.FC<TagFormProps> = ({ tag, onSubmit }) => {
  const defaultValues = pick(tag, tagFormFields);

  const { register, getValues, handleSubmit, reset } = useForm<TagInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      // todo: validate
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });

  useSyncForm(reset, defaultValues, tag);
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
