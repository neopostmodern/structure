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
  AddNoteMutation,
  AddNoteMutationVariables,
} from '../generated/graphql'
import { ADD_NOTE_MUTATION } from '../utils/sharedQueriesAndFragments'
import { isUrlValid } from '../utils/textHelpers'
import ComplexLayout from './ComplexLayout'

const AddNotePage: FC = () => {
  const dispatch = useDispatch()
  const [defaultValue, setDefaultValue] = useState('')

  const [addNote, addNoteMutation] = useMutation<
    AddNoteMutation,
    AddNoteMutationVariables
  >(ADD_NOTE_MUTATION, {
    onCompleted: ({ createNote }) => {
      dispatch(replace(`/notes/${createNote._id}`))
    },
    onError: (error) => {
      console.error(error)
    },
    update: (cache, { data }) => {
      if (!data) {
        return
      }
      const { createNote } = data

      cache.modify({
        id: 'ROOT_QUERY',
        fields: {
          notes(currentRefs: Readonly<Array<{ __ref: string }>>) {
            return currentRefs.concat([{ __ref: `Note:${createNote._id}` }])
          },
        },
      })
    },
  })
  const handleSubmitUrl = useCallback(
    (url: string): void => {
      addNote({ variables: { url } })
    },
    [addNote],
  )

  const handleSubmitNote = useCallback(
    (variables: AddNoteMutationVariables) => {
      ;(async () => {
        try {
          await addNote({ variables })
        } catch (error) {
          console.error('[AddNotePage.handleSubmitText (addText)]', error)
        }
      })()
    },
    [addNote],
  )
  const handleCreateQuickTextNote = useCallback(() => {
    ;(async () => {
      try {
        await addNote()
      } catch (error) {
        console.error(
          '[AddNotePage.handleCreateQuickTextNote (addText)]',
          error,
        )
      }
    })()
  }, [addNote])

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
      handleSubmitNote({ description: urlOrText, title })
    }
  }, [urlSearchParams, isNoteAddedFromUrl, setIsNoteAddedFromUrl])

  return (
    <ComplexLayout loading={addNoteMutation.loading && 'Creating note'}>
      <ErrorSnackbar
        error={addNoteMutation.error}
        actionDescription={'create note'}
      />
      <Stack gap={1}>
        <AddNoteForm
          defaultValue={defaultValue}
          onSubmitUrl={handleSubmitUrl}
          onSubmitNote={handleSubmitNote}
          onAbort={handleAbort}
        />
        <Gap vertical={2} />
        <AddNoteFromClipboard
          onEdit={setDefaultValue}
          onSubmitNote={handleSubmitNote}
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
