import type { NextPage } from 'next';
import React, { useEffect } from 'react';

import { Grid, Container, Card } from '@mui/material';

import { createTheme } from '@mui/material/styles';

import { useZustandStore } from '../../services/zustand';

import DoctorItem from '../../components/molecules/DoctorItem';
import Loader from 'components/Loader';
import Header from 'components/molecules/Header';

const theme = createTheme();

const Home: NextPage = () => {
  const { getDoctors, doctors } = useZustandStore();

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md">
        <Grid container sx={{ marginTop: 2 }}>
          <Card
            variant="outlined"
            sx={{
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            Welcome
            <Grid container sx={{ justifyContent: 'center', p: 2 }}>
              {doctors ? (
                doctors.map((item: any) => (
                  <DoctorItem
                    id={item.id}
                    name={item.name}
                    speciality={item.speciality}
                    price={item.price}
                    sm={4}
                  />
                ))
              ) : (
                <Card sx={{ width: 1100 }}>
                  <Loader />
                </Card>
              )}
            </Grid>
          </Card>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
