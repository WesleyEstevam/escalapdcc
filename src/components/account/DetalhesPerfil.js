import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@mui/material';

export const DetalhesPerfil = (props) => {
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

      console.log(payload)

      // Agora você pode acessar as informações do token
      setValues((prevValues) => ({
        ...prevValues,
        ...payload
      }));
    } else {
      console.log('Token JWT não encontrado no localStorage.');
    }
  }, []); // O array de dependências vazio garante que o efeito seja executado apenas uma vez, após a renderização inicial

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      {...props}
    >
      <Card>
        <CardHeader
          subheader="Informações do proteiro"
          title="Usuário"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Primeiro nome"
                name="firstName"
                onChange={handleChange}
                required
                value={values.nomeCompleto}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Sobrenome"
                name="lastName"
                onChange={handleChange}
                required
                //value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="E-mail"
                name="email"
                onChange={handleChange}
                required
                value={values.username}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                onChange={handleChange}
                type="number"
                //value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Country"
                name="country"
                onChange={handleChange}
                required
                //value={values.country}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select State"
                name="state"
                onChange={handleChange}
                required
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {/*{states.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))} */}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
        </Box>
      </Card>
    </form>
  );
};
