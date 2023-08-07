import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  Grid,
  Container,
  Card,
  Button,
  Modal,
  Box,
  Typography,
} from "@mui/material";

import { useZustandStore } from "../../services/zustand";

import Loader from "components/Loader";
import Header from "components/molecules/Header";
import CustomDatePicker from "components/molecules/DatePicker";
import moment from "moment";

const ScheduleDoctor: NextPage = () => {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const { createSchedule, getDoctor, doctor }: any = useZustandStore();

  const [selectedDateFrom, setSelectedDateFrom] = useState<string | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<string | null>(null);

  useEffect(() => {
    getDoctor();
  }, [getDoctor]);

  const handleDateChangeFrom = (date: string | null) => {
    setSelectedDateFrom(date);
  };
  const handleDateChangeTo = (date: string | null) => {
    setSelectedDateTo(date);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      moment(selectedDateFrom).format("YYYY-MM-DD") !==
      moment(selectedDateTo).format("YYYY-MM-DD")
    )
      alert("Please select same date");
    await createSchedule({
      availableFrom: moment(selectedDateFrom).format("YYYY-MM-DD HH:mm:ss"),
      availableTo: moment(selectedDateTo).format("YYYY-MM-DD HH:mm:ss"),
    });
    await handleClose();
    await getDoctor();
  };

  const [open, setOpen] = React.useState(false);

  const handleClose = async () => setOpen(false);

  const handleSchedule = () => {
    setOpen(true);
  };

  return (
    <>
      <Header />
      <Container
        component="main"
        maxWidth="md"
        sx={{ margin: "auto", width: "100%" }}
      >
        <Grid container sx={{ marginTop: 2 }}>
          <Card
            variant="outlined"
            sx={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Schedule Doctor
            <Grid container sx={{ justifyContent: "center", p: 2 }}>
              <TableContainer component={Paper}>
                <Table
                  sx={{ minWidth: 650 }}
                  size="small"
                  aria-label="a dense table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Button variant="outlined" onClick={handleSchedule}>
                          Create Schedule
                        </Button>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle2" color="h6" align="left">
                          Available From
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" color="h6">
                          Available To
                        </Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="subtitle2" color="h6">
                          Time Slot
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctor &&
                      doctor.schedule.map((item: any, index: number) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="left">
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {moment(item.availableFrom).format(
                                "dddd, DD MMMM YYYY"
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {moment(item.availableTo).format(
                                "dddd, DD MMMM YYYY"
                              )}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              {moment(item.availableFrom).format("HH:ss")}
                              {" - "}
                              {moment(item.availableTo).format("HH:ss")}
                            </Typography>
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
              sx={{ mb: 4, textAlign: "center" }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              Create Schedule
            </Typography>
            <table>
              <tr>
                <td> Available From</td>
                <td>&nbsp;</td>
                <td>
                  <CustomDatePicker
                    selectedDate={selectedDateFrom}
                    handleDateChange={handleDateChangeFrom}
                  />
                </td>
              </tr>
              <tr>
                <td> Available To</td>
                <td>&nbsp;</td>
                <td>
                  <CustomDatePicker
                    selectedDate={selectedDateTo}
                    handleDateChange={handleDateChangeTo}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <Button variant="outlined" onClick={handleSubmit}>
                    Submit
                  </Button>
                </td>
              </tr>
            </table>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default ScheduleDoctor;
