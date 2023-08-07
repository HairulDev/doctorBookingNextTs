import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import { Button, Grid, Typography, Container, Card, Box, Modal } from '@mui/material';

import { createTheme } from '@mui/material/styles';

import { useZustandStore } from '../../services/zustand';
import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from 'components/molecules/Header';
import Star from 'components/molecules/Star';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const theme = createTheme();
const Appointment: NextPage = () => {
  const { getAppointment, appointment, delBooking, rateBooking } = useZustandStore();

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  };
  useEffect(() => {
    getAppointment();
  }, [getAppointment]);

  const handleDelBooking = async (id: any) => {
    await delBooking(id);
    await getAppointment();
  };

  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const gmt7Date = new Date(Date.now() - tzOffset).toISOString();
  const ymd = gmt7Date.slice(0, 16).replace('T', ' ');
  const momentYmd = moment(ymd).format('YYYY-MM-DD HH:mm');

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  const [rating, setRating] = useState<number>(1);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleRatingChange = (event: any) => {
    setRating(event.target.value);
  };

  const handleSubmitRate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await rateBooking({ rating }, selectedItemId);
    handleClose();
    await getAppointment();
  };

  const handleRate = async (id: string) => {
    setSelectedItemId(id);
    setOpen(true);
  };

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
            Your Appointment's
            <Grid container sx={{ justifyContent: 'center', p: 2 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {' '}
                        <Typography variant="subtitle2" color="h6" align="left">
                          Doctor
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {' '}
                        <Typography variant="subtitle2" color="h6">
                          Speciality
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        {' '}
                        <Typography variant="subtitle2" color="h6">
                          Date
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {' '}
                        <Typography variant="subtitle2" color="h6">
                          Time Slot
                        </Typography>
                      </TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointment &&
                      appointment.map((item: any, index: number) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="left">
                            <Typography variant="subtitle2" color="text.secondary">
                              {item.profile.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {' '}
                            <Typography variant="subtitle2" color="text.secondary">
                              {item.profile.speciality}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography variant="subtitle2" color="text.secondary">
                              {moment(item.timeSlot).format('dddd, DD MMMM YYYY')} &nbsp;
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" color="text.secondary">
                              {moment(item.timeSlot).format('HH:mm')} &nbsp;
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            {momentYmd <= moment(item.timeSlot).format('YYYY-MM-DD HH:mm') && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  handleDelBooking(item.id);
                                }}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {momentYmd >= moment(item.timeSlot).format('YYYY-MM-DD HH:mm') && (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  handleRate(item.id);
                                }}
                              >
                                Rate
                              </Button>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="subtitle2" color="text.secondary">
                              {moment(item.timeSlot).fromNow()} &nbsp;
                            </Typography>
                            <Star value={item.rating} width={35} height={35} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Card>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              sx={{ mb: 4, textAlign: 'center' }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Rate
            </Typography>
            <form onSubmit={handleSubmitRate}>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={rating}
                  onChange={handleRatingChange}
                >
                  <FormControlLabel value={1} control={<Radio />} label="1" />
                  <FormControlLabel value={2} control={<Radio />} label="2" />
                  <FormControlLabel value={3} control={<Radio />} label="3" />
                  <FormControlLabel value={4} control={<Radio />} label="4" />
                  <FormControlLabel value={5} control={<Radio />} label="5" />
                </RadioGroup>
                <Button variant="outlined" type="submit">
                  Submit
                </Button>
              </FormControl>
            </form>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Appointment;
