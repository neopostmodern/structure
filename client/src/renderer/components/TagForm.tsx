import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { TagsQuery } from '../generated/graphql';
import useSyncForm from '../hooks/useSyncForm';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import ColorInput from './ColorInput';
import { NameInput } from './formComponents';

type TagType = TagsQuery['tags'][number];

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

  const formProps = useForm<TagInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      // todo: validate
      if (!isEqual(formValues, defaultValues)) {
        onSubmit(formValues);
      }
      return { values: formValues, errors: {} };
    },
  });
  const { register, getValues, handleSubmit, reset } = formProps;

  useSyncForm(reset, defaultValues, tag);
  useSaveOnUnmount({ onSubmit, defaultValues }, { getValues });

  return (
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ColorInput color={tag.color} name="color" tagName={tag.name} />

        <NameInput type="text" {...register('name', { required: true })} />
      </form>
    </FormProvider>
  );
};

export default TagForm;
