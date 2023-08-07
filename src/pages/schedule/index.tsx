import type { NextPage } from 'next';
import React, { useEffect } from 'react';

import { Grid, Container, Card } from '@mui/material';

import { createTheme } from '@mui/material/styles';

import { useZustandStore } from '../../services/zustand';

import DoctorItem from '../../components/molecules/DoctorItem';
import Loader from 'components/Loader';
import Header from 'components/molecules/Header';
import { useRouter } from 'next/router';

const theme = createTheme();

const Schedule: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { getSchedule, schedule }: any = useZustandStore();

  useEffect(() => {
    if (id) getSchedule(id);
  }, [id, getSchedule]);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ margin: 'auto', width: '100%' }}>
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
            Schedule Doctor
            <Grid container sx={{ justifyContent: 'center', p: 2 }}>
              {schedule ? (
                <DoctorItem
                  sm={12}
                  id={schedule.data.id}
                  name={schedule.data.name}
                  speciality={schedule.data.speciality}
                  price={schedule.data.price}
                  timeSlot={schedule.timeSlot}
                />
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

export default Schedule;
