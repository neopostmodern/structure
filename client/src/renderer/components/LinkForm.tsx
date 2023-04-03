import { pick } from 'lodash';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LinkQuery } from '../generated/graphql';
import useHasPermission from '../hooks/useHasPermission';
import useSyncForm from '../hooks/useSyncForm';
import { isUrlValid } from '../utils/textHelpers';
import { OptionalReactComponent } from '../utils/types';
import useSaveOnUnmount from '../utils/useSaveOnUnmount';
import LinkNameField from './fields/LinkNameField';
import UrlField from './fields/UrlField';
import { FormSubheader } from './formComponents';
import Gap from './Gap';
import MarkedTextarea from './MarkedTextarea';

const linkFormFields: Array<keyof LinkQuery['link']> = [
  '_id',
  'updatedAt',
  'url',
  'name',
  'description',
  'archivedAt',
];
export type LinkInForm = Pick<LinkQuery['link'], typeof linkFormFields[number]>;

type LinkFormProps = {
  link: LinkQuery['link'];
  onSubmit: (updatedLink: LinkInForm) => void;
  tagsComponent?: OptionalReactComponent;
};

const LinkForm: React.FC<LinkFormProps> = ({
  link,
  onSubmit,
  tagsComponent,
}) => {
  const defaultValues = pick(link, linkFormFields);
  const onlyReadPermission = !useHasPermission(link, 'notes', 'write');

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
  const { watch, handleSubmit, reset } = formProps;

  useSyncForm(reset, defaultValues, link);
  useSaveOnUnmount({ onSubmit, defaultValues }, formProps);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...formProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LinkNameField
          url={watch('url')}
          name="name"
          linkId={link._id}
          readOnly={onlyReadPermission}
        />
        <UrlField name="url" readOnly={onlyReadPermission} />

        {tagsComponent && (
          <>
            <Gap vertical={1} />
            {tagsComponent}
          </>
        )}
        <Gap vertical={2} />

        <FormSubheader>Description / notes</FormSubheader>
        <MarkedTextarea name="description" readOnly={onlyReadPermission} />
      </form>
    </FormProvider>
  );
};

export default LinkForm;
