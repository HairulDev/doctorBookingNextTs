import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import {
  Button,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  Divider,
  Card,
  FormControlLabel,
  Switch
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import GitHubIcon from '@mui/icons-material/GitHub';
import { useZustandStore } from '../../services/zustand';
import supabase from '../../services/supabase';

import GoogleIconColor from '../../assets/images/icons/google.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const theme = createTheme();

const Home: NextPage = () => {
  const { signInApp, signUpApp, user } = useZustandStore();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/home');
  }, [user]);

  const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  const [form, setForm] = useState(initialState);
  const [fileName, setFileName] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [disableSignUp, setDisableSignUp] = useState(false);
  const [disableSignIn, setDisableSignIn] = useState(false);
  const [agree, setAgree] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const [errorPasswordMatch, setErrorMatch] = useState('');
  const [errorPasswordValidated, setErrorValidated] = useState('');

  const [openModal, setOpenModal] = useState(false);
  const [checked, setChecked] = useState(false);

  // switching to mode sign in or sign up
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };
  const switchModeDoctor = () => {
    setIsDoctor((prevIsSignup) => !prevIsSignup);
  };
  // end switching to mode sign in or sign up

  useEffect(() => {
    if (disableSignUp === null && disableSignIn === null) {
      setDisableSignUp(false);
      setDisableSignIn(false);
    }
  }, [0]);

  useEffect(() => {
    if (!errorPasswordMatch) {
      setDisableSignIn(true);
    } else {
      setDisableSignIn(false);
    }
  }, [form.email, form.password, form.confirmPassword]);

  // checking match password
  useEffect(() => {
    if (form.password !== form.confirmPassword) {
      setErrorMatch("Password don't match");
    } else {
      setErrorMatch('');
    }
  }, [form.password, form.confirmPassword]);
  // end checking match password

  // validation password
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  useEffect(() => {
    const checkPass = validatePassword(form.password);
    if (form.password && checkPass === false) {
      setErrorValidated(
        `Your password must contain:\n At least 8 characters\n At least 3 of the following:\n Lower case letters (a-z)\n Upper case letters (A-Z)\n Numbers (0-9)\n Special characters (e.g. !@#$%^&*)`
      );
    } else {
      setErrorValidated('');
    }
  }, [form.password]);
  // end validation password

  // handle change form
  const onChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginOAuth = async (param: any) => {
    await supabase.auth.signInWithOAuth({
      provider: param
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (isSignup) {
      if (isDoctor) {
        await signUpApp({ ...form }, 'doctor');
      } else {
        await signUpApp({ ...form }, '');
      }
    } else {
      await signInApp({ ...form });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" sx={{ marginTop: 2 }}>
        <Card
          variant="outlined"
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <form onSubmit={handleSubmit} autoComplete="on">
            {isSignup && (
              <>
                <TextField
                  sx={{ mb: 3 }}
                  autoComplete="off"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={onChange}
                />
                {isDoctor && (
                  <>
                    <TextField
                      sx={{ mb: 3 }}
                      autoComplete="off"
                      name="speciality"
                      required
                      fullWidth
                      label="Speciality"
                      onChange={onChange}
                    />
                    <TextField
                      sx={{ mb: 3 }}
                      autoComplete="off"
                      name="price"
                      required
                      fullWidth
                      label="Price"
                      onChange={onChange}
                      type="number"
                    />
                  </>
                )}
              </>
            )}
            <TextField
              sx={{ mb: 3 }}
              autoComplete="off"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              onChange={onChange}
            />
            <TextField
              sx={{ mb: 3 }}
              autoComplete="off"
              required
              fullWidth
              name="password"
              type="password"
              label="Password"
              id="password"
              onChange={onChange}
              error={Boolean(errorPasswordValidated)}
              helperText={errorPasswordValidated}
            />
            <TextField
              sx={{ mb: 5 }}
              autoComplete="off"
              fullWidth
              name="confirmPassword"
              type="password"
              label="Repeat Password"
              onChange={onChange}
              error={Boolean(errorPasswordMatch)}
              helperText={errorPasswordMatch}
            />
            {!isSignup ? (
              <>
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3 }}
                >
                  {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <Divider sx={{ p: 2 }}>
                  <Typography sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>or</Typography>
                </Divider>

                <Button
                  onClick={() => loginOAuth('google')}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  <Image src={GoogleIconColor} alt="Google Icon" width={20} height={20} />
                  &nbsp; Sign In with Google
                </Button>
                <Button
                  onClick={() => loginOAuth('github')}
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  <GitHubIcon style={{ marginRight: 5, color: 'black' }} /> Sign In with Github
                </Button>
              </>
            ) : (
              <>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isDoctor}
                      onChange={switchModeDoctor}
                      aria-label="login switch"
                      color="warning"
                    />
                  }
                  label={isDoctor ? 'Signup as Patient' : 'Sign up as Doctor'}
                />
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 3, mb: 2 }}
                >
                  {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
              </>
            )}
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} textAlign="left">
                <Typography variant="subtitle1" onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/home" variant="body2" style={{ textDecoration: 'none' }}>
                  Go to Homepage
                </Link>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
