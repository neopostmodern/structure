import { pick } from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LinkType } from '../types';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import LinkNameField from './fields/LinkNameField';
import UrlField from './fields/UrlField';
import { FormSubheader } from './formComponents';
import MarkedTextarea from './MarkedTextarea';

const linkFormFields = [
  '_id',
  'url',
  'domain',
  'path',
  'name',
  'description',
  'archivedAt',
];
type LinkInForm = Pick<LinkType, typeof linkFormFields[number]>;

type LinkFormProps = {
  link: LinkType;
  onSubmit: (updatedLink: LinkType) => void;
};

const LinkForm: React.FC<LinkFormProps> = ({ link, onSubmit }) => {
  const defaultValues = pick(link, linkFormFields);

  const formProps = useForm<LinkInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      onSubmit(formValues);
      return { values: formValues, errors: {} };
    },
  });
  const { watch } = formProps;

  useSaveOnUnmount({ onSubmit, defaultValues }, formProps);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form>
        <UrlField name="url" />

        <LinkNameField url={watch('url')} name="name" />

        <FormSubheader>Description / notes</FormSubheader>
        <MarkedTextarea name="description" />
      </form>
    </FormProvider>
  );
};

export default LinkForm;
