import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import image404 from '../../../assets/images/image404.png';

import { Button, Grid } from '@mui/material';
import { useZustandStore } from '../../../services/zustand';
import Image from 'next/image';
import convertToRupiah from '../../../utils/formatCurrency';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/router';

interface TimeSlot {
  time: string;
  available: boolean;
  booked: boolean;
}

export default function DoctorItem(props: any) {
  const router = useRouter();
  const { id, name, speciality, price, sm, timeSlot }: any = props;

  var userJson: any = '';
  if (typeof window !== 'undefined') {
    userJson = localStorage.getItem('sb-wnpukijoybwfgrpearge-auth-token');
  }
  const user = userJson ? JSON.parse(userJson) : null;
  const tokenProfile: any = user ? user.access_token : null;

  const { createBooking, getDoctors } = useZustandStore();
  const [disabledButtons, setDisabledButtons] = useState(Array(timeSlot?.length).fill(false));

  const handleButtonClick = (index, time: string) => {
    const newDisabledButtons = [...disabledButtons];
    newDisabledButtons[index] = !newDisabledButtons[index];
    setDisabledButtons(newDisabledButtons);

    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const gmt7Date = new Date(Date.now() - tzOffset).toISOString();
    const ymd = gmt7Date.slice(0, 10);

    const selectedTimeSlot = `${ymd} ${time}`;

    const existingTimeSlots = localStorage.getItem('timeSlots');
    let existingTimeSlotsArray = existingTimeSlots ? JSON.parse(existingTimeSlots) : [];

    const slotIndex = existingTimeSlotsArray.indexOf(selectedTimeSlot);
    if (slotIndex !== -1) {
      existingTimeSlotsArray.splice(slotIndex, 1);
    } else {
      existingTimeSlotsArray.push(selectedTimeSlot);
    }
    localStorage.setItem('timeSlots', JSON.stringify(existingTimeSlotsArray));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = localStorage.getItem('timeSlots');
    const timeSlots = payload ? JSON.parse(payload) : [];
    await createBooking({ timeSlots }, id);
    localStorage.removeItem('timeSlots');
    router.push('/appointment');
  };

  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const gmt7Date = new Date(Date.now() - tzOffset).toISOString();
  const ymd = gmt7Date.slice(0, 16).replace('T', ' ');
  const momentYmd = moment(ymd).format('YYYY-MM-DD HH:mm');

  return (
    <Grid sm={sm}>
      <Link href={`/schedule?id=${id}`}>
        <Card sx={{ m: 1 }}>
          <CardMedia>
            <Image src={image404} />
          </CardMedia>
          <CardContent>
            <Typography variant="h6" color="text.secondary">
              {name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {speciality}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {`${convertToRupiah(price)} / session`}
            </Typography>
            <table style={{ width: '100%', marginTop: '10px' }}>
              {timeSlot &&
                timeSlot.map((slot: any, index: number) => {
                  const slotDateTime = `${moment(momentYmd).format('YYYY-MM-DD')} ${slot.time}`;
                  return (
                    <tr key={index}>
                      <td>
                        <Button
                          variant="outlined"
                          key={slot.time}
                          onClick={() => handleButtonClick(index, slot.time)}
                          disabled={
                            !slot.available || slot.booked || moment().isAfter(slotDateTime)
                          }
                          sx={{ m: 1 }}
                        >
                          {disabledButtons[index] ? <CheckCircleOutlineIcon /> : ''} {slot.time}
                        </Button>
                      </td>
                      <td>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          style={{
                            color: moment().isAfter(slotDateTime)
                              ? 'red'
                              : slot.available && !slot.booked
                              ? 'green'
                              : slot.booked
                              ? 'gray'
                              : 'black'
                          }}
                        >
                          {moment().isAfter(slotDateTime)
                            ? 'Expired'
                            : '' || (slot.available && !slot.booked)
                            ? 'Available'
                            : 'Not Available' || slot.booked
                            ? 'Booked'
                            : ''}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
            </table>
          </CardContent>
          {timeSlot && (
            <>
              <CardActions disableSpacing>
                <Button
                  variant="outlined"
                  sx={{ m: 2 }}
                  fullWidth
                  onClick={handleSubmit}
                  // onClick={() => {
                  //   handleDelete(id);
                  // }}
                >
                  Book Now
                </Button>
              </CardActions>
            </>
          )}
        </Card>
      </Link>
    </Grid>
  );
}
