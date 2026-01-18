import { ContentCopy, Launch, Share } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import useIsOnline from '../../hooks/useIsOnline'
import { openInDefaultBrowser, shareUrl } from '../../utils/openWith'
import { StructureTextField } from '../formComponents'

interface UrlFieldProps {
  name: string
  readOnly?: boolean
}

const UrlField: React.FC<UrlFieldProps> = ({
  name,
  readOnly: forceReadOnly = false,
}) => {
  const { watch, register, getValues, formState } = useFormContext()
  const [forceShowUrlField, setForceShowUrlField] = useState(
    Boolean(getValues(name)),
  )

  const isOnline = useIsOnline()
  const readOnly = !isOnline || forceReadOnly

  if (!getValues(name) && !forceShowUrlField) {
    return (
      <Button
        variant='outlined'
        size='small'
        onClick={() => setForceShowUrlField(true)}
      >
        Add URL
      </Button>
    )
  }

  const { onBlur, ...registerProps } = register(name)

  return (
    <>
      <Box display='flex' alignItems='end'>
        <StructureTextField
          type='text'
          label='URL'
          InputProps={{ readOnly, autoFocus: forceShowUrlField }}
          onBlur={(event) => {
            onBlur(event)
            if (!event.target.value) {
              setForceShowUrlField(false)
            }
          }}
          {...registerProps}
        />
        <Tooltip title='Copy URL'>
          <IconButton
            style={{ marginLeft: '1rem' }}
            onClick={() => {
              navigator.clipboard.writeText(getValues(name))
            }}
          >
            <ContentCopy />
          </IconButton>
        </Tooltip>
        {navigator.share && (
          <Tooltip title='Share URL'>
            <IconButton
              onClick={() => {
                shareUrl(getValues(name), getValues('name'))
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Open in default browser'>
          <IconButton
            onClick={(): void => {
              openInDefaultBrowser(watch(name))
            }}
          >
            <Launch />
          </IconButton>
        </Tooltip>
      </Box>
      {formState.errors[name] && (
        <div style={{ color: 'red', fontSize: '80%' }}>
          {formState.errors[name]}
        </div>
      )}
    </>
  )
}

export default UrlField
