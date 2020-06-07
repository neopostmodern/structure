import React from 'react'
import { FormContext, useForm } from 'react-hook-form'

import MarkedTextarea from './MarkedTextarea'
import { FormSubheader } from './formComponents'
import LinkNameField from './fields/LinkNameField'
import UrlField from './fields/UrlField'
import { LinkType } from '../types'

type LinkFormProps = {
  link: LinkType
  onSubmit: (updatedLink: LinkType) => void
}

const LinkForm: React.FC<LinkFormProps> = ({ link, onSubmit }) => {
  const submitLink = (updatedFormValues: LinkType): void => {
    onSubmit({ _id: link._id, ...updatedFormValues })
  }

  const formProps = useForm<LinkType>({
    defaultValues: link,
    mode: 'onBlur',
    validationResolver: (formValues) => {
      // todo: validate
      submitLink(formValues)
      return { values: formValues, errors: {} }
    },
  })
  const { handleSubmit, watch } = formProps
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormContext {...formProps}>
      <form onSubmit={handleSubmit(submitLink)}>
        <UrlField name='url' />

        <LinkNameField url={watch('url')} name='name' />

        <FormSubheader>Description / notes</FormSubheader>
        <MarkedTextarea name='description' />
      </form>
    </FormContext>
  )
}

export default LinkForm
