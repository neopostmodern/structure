import { pick } from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LinkQuery_link } from '../generated/LinkQuery';
import { isUrlValid } from '../utils/textHelpers';
import { OptionalReactComponent } from '../utils/types';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import LinkNameField from './fields/LinkNameField';
import UrlField from './fields/UrlField';
import { FormSubheader } from './formComponents';
import Gap from './Gap';
import MarkedTextarea from './MarkedTextarea';

const linkFormFields: Array<keyof LinkQuery_link> = [
  '_id',
  'updatedAt',
  'url',
  'name',
  'description',
  'archivedAt',
];
type LinkInForm = Pick<LinkQuery_link, typeof linkFormFields[number]>;

type LinkFormProps = {
  link: LinkQuery_link;
  onSubmit: (updatedLink: LinkQuery_link) => void;
  tagsComponent?: OptionalReactComponent;
};

const LinkForm: React.FC<LinkFormProps> = ({
  link,
  onSubmit,
  tagsComponent,
}) => {
  const defaultValues = pick(link, linkFormFields);

  const formProps = useForm<LinkInForm>({
    defaultValues,
    mode: 'onBlur',
    resolver: (formValues) => {
      const errors: { [key: string]: string } = {};
      if (!formValues.url) {
        errors.url = 'URL is required';
      } else if (!isUrlValid(formValues.url)) {
        errors.url =
          'Not a valid URL – did you forget the protocol? (e.g. https://)';
      }
      if (Object.keys(errors).length === 0) {
        onSubmit(formValues);
      }
      return { values: formValues, errors };
    },
  });
  const { watch, handleSubmit } = formProps;

  useSaveOnUnmount({ onSubmit, defaultValues }, formProps);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LinkNameField url={watch('url')} name="name" linkId={link._id} />
        <UrlField name="url" />

        {tagsComponent && (
          <>
            <Gap vertical={1} />
            {tagsComponent}
          </>
        )}
        <Gap vertical={2} />

        <FormSubheader>Description / notes</FormSubheader>
        <MarkedTextarea name="description" />
      </form>
    </FormProvider>
  );
};

export default LinkForm;
