import { pick } from 'lodash';
import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { NoteObject } from '../reducers/links';
import { OptionalReactComponent } from '../utils/types';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import { NameInput } from './formComponents';
import Gap from './Gap';
import MarkedTextarea from './MarkedTextarea';

const textFormFields: Array<keyof NoteObject> = ['_id', 'name', 'description'];
type TextInForm = Pick<NoteObject, typeof textFormFields[number]>;

interface TextFormProps {
  text: NoteObject;
  onSubmit: (text: NoteObject) => void;
  tagsComponent?: OptionalReactComponent;
}

const TextForm: React.FC<TextFormProps> = ({
  text,
  onSubmit,
  tagsComponent,
}) => {
  const defaultValues = pick(text, textFormFields) as TextInForm;
  const formProps = useForm<TextInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });
  const { register, reset, handleSubmit } = formProps;
  useEffect(() => {
    reset(defaultValues);
  }, [reset, text]);

  useSaveOnUnmount({ onSubmit, defaultValues }, formProps);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <NameInput type="text" {...register('name', { required: true })} />

        {tagsComponent && (
          <>
            <Gap vertical={1} />
            {tagsComponent}
          </>
        )}
        <Gap vertical={2} />

        <MarkedTextarea name="description" />
      </form>
    </FormProvider>
  );
};

export default TextForm;
