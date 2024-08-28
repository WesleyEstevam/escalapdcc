import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';

const user = {
  avatar: '/images/avatars/doorman.png'
};

export const FotoPerfil = () => {
  const [values, setValues] = useState({
    username: '',
    nomeCompleto: ''
    // Adicione outras propriedades do estado aqui
  });

  useEffect(() => {
    // Passo 1: Acessar o localStorage
    const token = localStorage.getItem('token');

    // Passo 2: Verificar se o valor do token não é nulo ou indefinido
    if (token) {
      // Passo 3: Decodificar o token JWT
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));

      // Agora você pode acessar as informações do token
      setValues((prevValues) => ({
        ...prevValues,
        ...payload
      }));
    } else {
      console.log('Token JWT não encontrado no localStorage.');
    }
  }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez, após a renderização inicial

  /*   const handleChange = (event) => {
      setValues({
        ...values,
        [event.target.name]: event.target.value
      });
    }; */

  return (
    <Box >
      <Card sx={{ display: 'flex', justifyContent: 'center' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Avatar
              src= {user.avatar}
              sx={{
                height: 150,
                mb: 2,
                width: 150
              }}
            />
            <Typography
              color="textPrimary"
              gutterBottom
              variant="h5"
            >
              {values.nomeCompleto}
            </Typography>
            <Typography
              color="textPrimary"
              gutterBottom
            //variant="h5"
            >
              {values.username}
            </Typography>
            Porteiro
          </Box>
        </CardContent>
        <Divider />
      </Card>
    </Box>
  )
};