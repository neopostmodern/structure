import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import {
  ExportFile,
  IMPORT_COMPLETE,
  useDataImport,
} from '../hooks/useDataImport'
import humanReadableFileSize from '../utils/humanReadableFileSize'
import DropFile from './DropFile'

const ImportDataWithButton = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [importData, setImportData] = useState<ExportFile | null>(null)
  const { currentImport, doImport, clearImport } = useDataImport()
  const openModal = useCallback(() => setModalOpen(true), [setModalOpen])
  const closeModal = useCallback(() => {
    if (currentImport && currentImport !== IMPORT_COMPLETE) {
      return
    }
    setModalOpen(false)
    setImportData(null)
    clearImport()
  }, [currentImport, setModalOpen, setImportData, clearImport])
  useEffect(() => {
    if (!currentImport) {
      return
    }
    if (currentImport === IMPORT_COMPLETE) {
      window.onbeforeunload = null
    } else {
      // warn users before navigating away
      window.onbeforeunload = function () {
        return true
      }
    }
  }, [currentImport])
  const handleDropFiles = useCallback(
    (files: FileList) => {
      const [jsonFile, ...moreFiles] = Array.from(files)
      if (moreFiles.length) {
        alert(
          `Please upload only exactly one JSON file, not ${files.length} files!`,
        )
        return
      }
      if (jsonFile.type !== 'application/json') {
        alert(
          `Can only handle JSON files, not '${jsonFile.type}': ${jsonFile.name}`,
        )
        return
      }
      const reader = new FileReader()
      reader.onloadend = function () {
        if (typeof this.result === 'string') {
          const result = JSON.parse(this.result)
          if (!result?.meta?.exportedFrom?.includes('http')) {
            alert('Imported JSON is not a valid Structure export!')
            return
          }
          result.meta.exportedAt = new Date(result.meta.exportedAt)
          result.meta.fileSize = jsonFile.size
          setImportData(result)
        }
      }
      reader.readAsText(jsonFile)
    },
    [setImportData],
  )
  const handleImport = useCallback(() => {
    if (!importData) {
      throw Error(
        '[ImportDataWithButton.handleImport]: Illegal state - no importData present.',
      )
    }
    doImport(importData)
  }, [doImport, importData])

  let dialogContent
  if (currentImport === IMPORT_COMPLETE) {
    dialogContent = 'Import complete!'
  } else if (currentImport) {
    dialogContent = (
      <>
        <LinearProgress
          variant='determinate'
          value={currentImport.progress * 100}
        />
        <Typography variant='caption'>
          Processing {currentImport.entityName}...
        </Typography>
      </>
    )
  } else if (importData) {
    dialogContent = (
      <>
        {importData.user.name}'s data from{' '}
        {importData.meta.exportedFrom.replace(/https?:\/\//, '')}:<br />
        {importData.notes.length} notes and {importData.tags.length} tags (
        {humanReadableFileSize(importData.meta.fileSize)}, exported{' '}
        {importData.meta.exportedAt.toISOString().split('T')[0]})
        <Box marginTop={1}>
          <Typography variant='caption'>
            Important hints: the data importer is very basic at the moment. IDs,
            creation time, and update time will not preserved. Data is not
            merged. Use at your own risk. Very slow.
          </Typography>
        </Box>
      </>
    )
  } else {
    dialogContent = <DropFile onDropFiles={handleDropFiles} />
  }

  let actions
  if (currentImport === IMPORT_COMPLETE) {
    actions = <Button onClick={closeModal}>Close</Button>
  } else if (!currentImport) {
    actions = (
      <>
        <Button onClick={closeModal}>Cancel</Button>
        <Button onClick={handleImport} disabled={!importData}>
          Import data
        </Button>
      </>
    )
  }

  return (
    <>
      <Button size='huge' onClick={openModal}>
        Import data
      </Button>
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>Import data from JSON</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    </>
  )
}

export default ImportDataWithButton
