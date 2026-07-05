import { useCallback, useEffect, useState } from 'react'
import browser from 'webextension-polyfill'
import { ArchiveState, SortBy } from '../../renderer/actions/userInterface'
import type { NotesForSortAndFilterQuery } from '../../renderer/generated/graphql'
import { useAddNote } from '../../renderer/hooks/notes'
import {
  MAGIC_SKIP,
  useSortedFilteredNotesExplicit,
} from '../../renderer/hooks/useSortedFilteredNotes'
import {
  DataState,
  LazyPolicedData,
  PolicedData,
} from '../../renderer/utils/useDataState'
import { moreCanonicalUrl } from '../util'

const LINKED_URL_STORAGE_KEY = 'linkedUrl'
interface LinkedNoteEntry {
  url: string
  noteId: string
}

const useAddCurrentTabNote = () => {
  const [noteId, setNoteId] = useState<PolicedData<string | null>>({
    state: DataState.LOADING,
  })
  const [url, setUrl] = useState<string>()
  const [searchUrl, setSearchUrl] = useState<string>(MAGIC_SKIP)
  const [similarNotes, setSimilarNotes] = useState<
    LazyPolicedData<NotesForSortAndFilterQuery['notes']>
  >({ state: DataState.UNCALLED })

  const cachedNotes = useSortedFilteredNotesExplicit({
    archiveState: ArchiveState.BOTH,
    sortBy: SortBy.CHANGED_AT,
    searchQuery: searchUrl,
  })

  useEffect(() => {
    ;(async () => {
      const [activeTab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (!activeTab?.url) {
        throw new Error('Could not determine the current tab URL.')
      }
      setUrl(activeTab.url)
      const lastLinkedNote = (
        await browser.storage.local.get(LINKED_URL_STORAGE_KEY)
      )[LINKED_URL_STORAGE_KEY] as LinkedNoteEntry | null
      if (
        lastLinkedNote &&
        moreCanonicalUrl(activeTab.url) === moreCanonicalUrl(lastLinkedNote.url)
      ) {
        setNoteId({
          state: DataState.DATA,
          data: lastLinkedNote.noteId as string,
          loadingBackground: false,
        })
      } else {
        setSearchUrl(activeTab.url)
      }
    })()
  }, [setUrl, setSearchUrl, setNoteId])

  useEffect(() => {
    if (noteId.state === DataState.DATA) {
      return
    }

    if (cachedNotes.state === DataState.ERROR) {
      if (url === searchUrl) {
        setNoteId(cachedNotes)
      } else {
        setSimilarNotes(cachedNotes)
      }
      return
    }

    if (cachedNotes.state !== DataState.DATA) {
      return
    }

    if (url !== searchUrl) {
      setNoteId({ state: DataState.DATA, data: null, loadingBackground: false })
      setSimilarNotes({
        state: DataState.DATA,
        data: cachedNotes.data.notes,
        loadingBackground: false,
      })
      return
    }

    if (
      cachedNotes.state === DataState.DATA &&
      cachedNotes.data.notes.length === 1
    ) {
      setNoteId({
        state: DataState.DATA,
        data: cachedNotes.data.notes[0]._id,
        loadingBackground: false,
      })
      return
    }

    const widenedSearchUrl = moreCanonicalUrl(url)
    if (widenedSearchUrl !== url) {
      setSearchUrl(widenedSearchUrl)
      setSimilarNotes({ state: DataState.LOADING })
    } else {
      setSimilarNotes({
        state: DataState.DATA,
        data: [],
        loadingBackground: false,
      })
    }
  }, [
    noteId,
    cachedNotes,
    url,
    searchUrl,
    setNoteId,
    setSearchUrl,
    setSimilarNotes,
  ])

  const [addNote, addNoteMutation] = useAddNote({
    onCompleted: ({ createNote }) => {
      setNoteId({
        state: DataState.DATA,
        data: createNote._id,
        loadingBackground: false,
      })
    },
  })

  const add = useCallback(() => {
    ;(async () => {
      try {
        await addNote({ variables: { url } })
      } catch (error) {
        console.error('[useAddCurrentTabNote.add]', error)
      }
    })()
  }, [addNote, url])

  const linkNoteId = useCallback(
    (noteId: string | null) => {
      setNoteId({
        state: DataState.DATA,
        data: noteId,
        loadingBackground: false,
      })
      ;(async () => {
        if (noteId === null) {
          await browser.storage.local.remove(LINKED_URL_STORAGE_KEY)
          setNoteId({ state: DataState.LOADING })
        } else {
          await browser.storage.local.set({
            [LINKED_URL_STORAGE_KEY]: {
              url,
              noteId,
            } as LinkedNoteEntry,
          })
        }
      })()
    },
    [setNoteId, url],
  )

  return {
    noteId,
    linkNoteId,
    add,
    addIsLoading: addNoteMutation.loading,
    addError: addNoteMutation.error,
    similarNotes,
    url,
  }
}

export default useAddCurrentTabNote
