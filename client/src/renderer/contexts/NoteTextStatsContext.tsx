import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

type TextOrigin = 'source' | 'rendered'

type NoteTextStats = {
  fullText: string
  selectedText: string
  textOrigin: TextOrigin
}

type NoteTextStatsSetters = {
  setFullText: (fullText: string) => void
  setSelectedText: (selectedText: string) => void
  setTextOrigin: (textOrigin: TextOrigin) => void
}

const defaultStats: NoteTextStats = {
  fullText: '',
  selectedText: '',
  textOrigin: 'source',
}

const noopSetters: NoteTextStatsSetters = {
  setFullText: () => {},
  setSelectedText: () => {},
  setTextOrigin: () => {},
}

const NoteTextStatsValueContext = createContext<NoteTextStats>(defaultStats)
const NoteTextStatsSettersContext =
  createContext<NoteTextStatsSetters>(noopSetters)

const setIfChanged = <Key extends keyof NoteTextStats>(
  setStats: Dispatch<SetStateAction<NoteTextStats>>,
  key: Key,
  value: NoteTextStats[Key],
): void => {
  setStats((previous) =>
    previous[key] === value ? previous : { ...previous, [key]: value },
  )
}

// having this as a context (instead of e.g. redux) keeps it ephemeral towards note page changes
export const NoteTextStatsProvider = ({ children }: PropsWithChildren) => {
  const [stats, setStats] = useState<NoteTextStats>(defaultStats)

  const setters = useMemo<NoteTextStatsSetters>(
    () => ({
      setFullText: (fullText) => setIfChanged(setStats, 'fullText', fullText),
      setSelectedText: (selectedText) =>
        setIfChanged(setStats, 'selectedText', selectedText),
      setTextOrigin: (textOrigin) =>
        setIfChanged(setStats, 'textOrigin', textOrigin),
    }),
    [],
  )

  return (
    <NoteTextStatsSettersContext.Provider value={setters}>
      <NoteTextStatsValueContext.Provider value={stats}>
        {children}
      </NoteTextStatsValueContext.Provider>
    </NoteTextStatsSettersContext.Provider>
  )
}

export const useNoteTextStats = () => useContext(NoteTextStatsValueContext)
export const useNoteTextStatsSetters = () =>
  useContext(NoteTextStatsSettersContext)
