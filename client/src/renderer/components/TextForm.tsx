import { pick } from 'lodash';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { NoteObject } from '../reducers/links';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import { NameInput } from './formComponents';
import MarkedTextarea from './MarkedTextarea';

const textFormFields: Array<keyof NoteObject> = ['_id', 'name', 'description'];
type TextInForm = Pick<NoteObject, typeof textFormFields[number]>;

interface TextFormProps {
  text: NoteObject;
  onSubmit: (text: NoteObject) => void;
}

const TextForm: React.FC<TextFormProps> = ({ text, onSubmit }) => {
  const defaultValues = pick(text, textFormFields) as TextInForm;
  const formProps = useForm<TextInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });
  const { register, reset } = formProps;
  useEffect(() => {
    reset(defaultValues);
  }, [reset, text]);

  useSaveOnUnmount({ onSubmit, defaultValues }, formProps);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form>
        <NameInput type="text" {...register('name', { required: true })} />
        <MarkedTextarea name="description" />
      </form>
    </FormProvider>
  );
};

export default TextForm;
