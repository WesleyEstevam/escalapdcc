import React, { useState } from 'react';
import { Typography, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import axios from 'axios'

const ModalComponent = ({ setPrevisao }) => {
  const [open, setOpen] = useState(false);
  //const [previsao, setPrevisao] = useState()

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    axios.get('http://127.0.0.1:5000')
    .then((response) => {
      setPrevisao(response.data) //ARRAY DE PREVISÕES
    })
    .catch((error) => {
      console.log(error + 'DEU RUIM, ERRO NA PREVISÃO')
    })
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleOpen}>
        Previsão
        <CalendarMonthIcon />
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
            Data da Previsão
          </Typography>
          <Button onClick={handleClose} sx={{ mt: -8, ml: 38, color: 'black' }}>
            X
          </Button>
          <TextField
            fullWidth
            type="datetime-local"
            variant="outlined"
          />

          <Button variant='contained' onClick={handleSubmit} sx={{ mt: 5, ml: 15 }}>
            Verificar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalComponent;
