import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { sendRequest } from '../utils/sendRequest';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [nameError, setNameError] = useState<boolean | string>(true);
  const [passwordError, setPasswordError] = useState<boolean | string>(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const checkDetails = (name: string, password: string) => {
    console.log(name, password);
    if (name.length < 3) {
      setNameError('Vardas per trumpas');
      return false;
    }
    if (password.length < 3) {
      setPasswordError('Slaptažodis per trumpas');
      return false;
    }
    clearErrors();
    return true;
  };

  const clearErrors = () => {
    setNameError(true);
    setPasswordError(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const checkResult = checkDetails(data.get('username') as string, data.get('password') as string);
    setErrorMessage(null);
    if (checkResult) {
      sendRequest('POST', 'api/login', { username: data.get('username'), password: data.get('password') })
        .then((result) => {
          console.log(result)
          if (result.res.status === 401) {
            setErrorMessage('Neteisingas vardas arba slaptažodis');
          }
          if (result.res.status === 200) {
            navigate('/');
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage('Serverio klaida. Prisijungti nepavyko! Palaukite ir bandykite dar kartą.');
        });
    }
  };

  useEffect(() => {
    sendRequest('GET', 'api/checkToken').then((result) => {
      if (result.res.status === 200) {
        navigate('/');
      }
    });
    return () => {
      
    }
  }, [])
  

  return (
    <Container component='main'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Prisijungimas
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Vardas'
            name='username'
            autoComplete='username'
            autoFocus
            error={nameError !== true}
            helperText={nameError}
            onChange={clearErrors}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Slaptažodis'
            type='password'
            id='password'
            autoComplete='current-password'
            error={passwordError !== true}
            helperText={passwordError}
            onChange={clearErrors}
          />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Prisijungti
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
