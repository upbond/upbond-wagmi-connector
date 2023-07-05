/* eslint-disable no-nested-ternary */
import { Close } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import * as React from 'react';

import useResponsiveWatchers from '../hooks/useLayoutWatcher';
import clsxm from '../lib/clsxm';

export default function ModalWrapper({
  handleClose,
  open,
  title = '',
  children,
  childClasses = [],
  width,
}: {
  handleClose: () => void;
  open: boolean;
  title?: string;
  children: React.ReactNode;
  childClasses?: string[];
  width?: number | string;
}) {
  const { smMatches, lgMatches } = useResponsiveWatchers();

  const style = {
    transform: 'translate(-50%, -50%)',
    width: width || (smMatches ? 400 : lgMatches ? 500 : 300),
    height: 'auto',
    maxHeight: 600,
  };

  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open} style={{ transitionDelay: '200ms' }}>
        <Box
          sx={style}
          className={clsxm('translate absolute top-1/2 left-1/2 rounded-md')}
        >
          <div
            className={clsxm(
              'h-full w-full rounded-md bg-white p-3',
              ...childClasses
            )}
          >
            {title !== '' && (
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <p className='text-lg font-bold'>{title}</p>
                <IconButton onClick={handleClose}>
                  <Close sx={{ color: '#111827' }} />
                </IconButton>
              </Stack>
            )}
            {children}
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
