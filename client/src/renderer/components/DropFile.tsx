import { UploadFile } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { DragEvent, PropsWithChildren, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';

const DropArea = styled.div<{
  fullPage: boolean;
  preventPointerEventsForChildren: boolean;
}>`
  ${({ fullPage }) =>
    fullPage &&
    css`
      min-height: 90vh;
    `}
  position: relative;
  ${({ preventPointerEventsForChildren = false }) =>
    preventPointerEventsForChildren &&
    css`
      * {
        pointer-events: none;
      }
    `}
`;

const FileDropArea = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.3rem ${({ theme }) => theme.palette.text.primary} dashed;
  background-color: rgba(0, 0, 0, 0.7);
`;

const DropFile = ({
  onDropFiles,
  fullPage = false,
  children,
}: PropsWithChildren<{
  onDropFiles: (files: FileList) => void;
  fullPage?: boolean;
}>) => {
  const [fileDrag, setFileDrag] = useState(false);

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      onDropFiles(event.dataTransfer.files);
    }
    setFileDrag(false);
  };

  const handleClickFileSelect = useCallback(() => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.onchange = (event) => {
      onDropFiles((event.target as HTMLInputElement).files!);
    };

    fileInput.click();
  }, [onDropFiles]);

  return (
    <DropArea
      fullPage={fullPage}
      onDrop={handleDrop}
      onDragOver={(event) => {
        event.preventDefault();
        setFileDrag(true);
      }}
      onDragLeave={() => setFileDrag(false)}
      preventPointerEventsForChildren={fileDrag}
    >
      {fileDrag && (
        <FileDropArea>
          <Typography color="primary">Drop file to upload</Typography>
        </FileDropArea>
      )}
      {children || (
        <Box
          padding={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          border="1px solid gray"
          minWidth="500px"
          minHeight="250px"
        >
          <UploadFile fontSize="large" />
          Drag file here
          <br />{' '}
          <Button variant="outlined" onClick={handleClickFileSelect}>
            Select a file
          </Button>
        </Box>
      )}
    </DropArea>
  );
};

export default DropFile;
