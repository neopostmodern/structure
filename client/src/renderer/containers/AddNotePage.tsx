import { useMutation } from '@apollo/client/react'
import { PostAdd } from '@mui/icons-material'
import { Stack } from '@mui/material'
import { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router'
import { push, replace } from 'redux-first-history'
import AddNoteCard from '../components/AddNoteCard'
import AddNoteForm from '../components/AddNoteForm'
import AddNoteFromClipboard from '../components/AddNoteFromClipboard'
import ErrorSnackbar from '../components/ErrorSnackbar'
import Gap from '../components/Gap'
import type {
  AddLinkMutation,
  AddLinkMutationVariables,
  AddTextMutation,
  AddTextMutationVariables,
  NotesForListQuery,
} from '../generated/graphql'
import {
  ADD_LINK_MUTATION,
  ADD_TEXT_MUTATION,
} from '../utils/sharedQueriesAndFragments'
import { isUrlValid } from '../utils/textHelpers'
import ComplexLayout from './ComplexLayout'
import { NOTES_QUERY } from './NotesPage/NotesPage'

const AddNotePage: FC = () => {
  const dispatch = useDispatch()
  const [defaultValue, setDefaultValue] = useState('')

  const [addLink, addLinkMutation] = useMutation<
    AddLinkMutation,
    AddLinkMutationVariables
  >(ADD_LINK_MUTATION, {
    onCompleted: ({ submitLink }) => {
      dispatch(replace(`/links/${submitLink._id}`))
    },
    onError: (error) => {
      console.error(error)
    },
    update: (cache, { data }) => {
      if (!data) {
        return
      }
      const { submitLink } = data

      const cacheValue = cache.readQuery<NotesForListQuery>({
        query: NOTES_QUERY,
      })

      if (!cacheValue) {
        return
      }

      const { notes } = cacheValue
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: [...notes, { ...submitLink, type: 'LINK' }] },
      })
    },
  })
  const handleSubmitUrl = useCallback(
    (url: string): void => {
      addLink({ variables: { url } })
    },
    [addLink],
  )

  const [addText, addTextMutation] = useMutation<
    AddTextMutation,
    AddTextMutationVariables
  >(ADD_TEXT_MUTATION, {
    onCompleted: ({ createText }) => {
      dispatch(replace(`/texts/${createText._id}`))
    },
    update: (cache, { data }) => {
      if (!data) {
        return
      }
      const { createText } = data

      const cacheValue = cache.readQuery<NotesForListQuery>({
        query: NOTES_QUERY,
      })

      if (!cacheValue) {
        return
      }

      const { notes } = cacheValue
      cache.writeQuery({
        query: NOTES_QUERY,
        data: { notes: [...notes, { ...createText, type: 'TEXT' }] },
      })
    },
  })
  const handleSubmitText = useCallback(
    (variables: AddTextMutationVariables) => {
      ;(async () => {
        try {
          await addText({ variables })
        } catch (error) {
          console.error('[AddNotePage.handleSubmitText (addText)]', error)
        }
      })()
    },
    [addText],
  )
  const handleCreateQuickTextNote = useCallback(() => {
    ;(async () => {
      try {
        await addText()
      } catch (error) {
        console.error(
          '[AddNotePage.handleCreateQuickTextNote (addText)]',
          error,
        )
      }
    })()
  }, [addText])

  const handleAbort = useCallback((): void => {
    dispatch(push('/'))
  }, [dispatch, push])

  const [isNoteAddedFromUrl, setIsNoteAddedFromUrl] = useState(false)
  const urlSearchParams = new URLSearchParams(useLocation().search)

  useEffect(() => {
    if (isNoteAddedFromUrl) {
      return
    }
    const urlOrText = urlSearchParams.get('url') || urlSearchParams.get('text')
    const title = urlSearchParams.get('title')

    if (!urlOrText) {
      return
    }

    setIsNoteAddedFromUrl(true)

    if (isUrlValid(urlOrText)) {
      handleSubmitUrl(urlOrText) // todo: handle title
    } else {
      handleSubmitText({ description: urlOrText, title })
    }
  }, [urlSearchParams, isNoteAddedFromUrl, setIsNoteAddedFromUrl])

  return (
    <ComplexLayout
      loading={
        (addLinkMutation.loading || addTextMutation.loading) && 'Creating note'
      }
    >
      <ErrorSnackbar
        error={addTextMutation.error || addLinkMutation.error}
        actionDescription={'create note'}
      />
      <Stack gap={1}>
        <AddNoteForm
          defaultValue={defaultValue}
          onSubmitUrl={handleSubmitUrl}
          onSubmitText={handleSubmitText}
          onAbort={handleAbort}
        />
        <Gap vertical={2} />
        <AddNoteFromClipboard
          onEdit={setDefaultValue}
          onSubmitText={handleSubmitText}
          onSubmitUrl={handleSubmitUrl}
        />
        <AddNoteCard
          title='Quick text-only note'
          icon={<PostAdd />}
          action={handleCreateQuickTextNote}
        />
      </Stack>
    </ComplexLayout>
  )
}

export default AddNotePage
