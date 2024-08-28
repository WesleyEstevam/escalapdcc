import React, { useState } from 'react';
import { Typography, TextField } from '@mui/material';
import { Upload as UploadIcon } from '../../icons/upload';
import { baseURL } from '../api/api'
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios'

export const Importar = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await axios.post(baseURL + "visitante/upload", formData)
        .then(() => {
          
        })
        .catch((error) => {
          console.log("Erro ao enviar o arquivo CSV: ", error);
        })
    }
    handleClose();
  }

  return (
    <div>
      <Button color='primary' onClick={handleOpen}>
        <UploadIcon fontSize="small" />
        Importar
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Selecione um arquivo CSV
          </Typography>
          <Button onClick={handleClose} sx={{ mt: -8, ml: 38, color: 'black' }}>
            X
          </Button>
          <TextField
            fullWidth
            type="file"
            accept=".csv"
            variant="outlined"
            onChange={handleFileChange}
          />

          <Button variant='contained' onClick={handleUpload} sx={{ mt: 5, ml: 15 }}>
            Cadastrar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};