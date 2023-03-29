import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { IEvent } from "../../typings/events";
import { sendRequest } from "../../utils/sendRequest";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import useStyles from "./events.styles";
import { RegistrationForm } from "./RegistrationForm";
import { MembersContainer } from "./MembersContainer";
import NumbersIcon from "@mui/icons-material/Numbers";
import { IMember } from "../../typings/members";

const DEBUG_EVENTS: IEvent[] = [
  {
    id: 1,
    name: "Renginys 1",
    date: "2021-10-10",
    attendees: 10,
  },
  {
    id: 1,
    name: "Renginys 1",
    date: "2021-10-10",
    attendees: 10,
  },
];

export default function EventsContainer() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<IEvent[]>(DEBUG_EVENTS);
  const [membersEventFilter, setMembersEventFilter] = useState<null | number>(
    null
  );

  const styles = useStyles();

  const navigate = useNavigate();
  useEffect(() => {
    sendRequest<IEvent[]>("GET", "api/events").then((result) => {
      if (result.res.status === 401) {
        navigate("/login");
      }
      setEvents(result.data);
      setLoading(false);
    });
  }, []);

  return (
    <Box
      sx={{
        position: "absolute",
        height: "100%",
        overflowY: "hidden",
        boxSizing: "border-box",
      }}
    >
      <NavBar title="Renginiai" />
      <Box
        sx={{
          p: 5,
          gap: 5,
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "2fr 3fr",
          gridTemplateRows: "auto 1fr",
          position: "relative",
          height: "100%",
        }}
      >
        <RegistrationForm
          events={events}
          onSubmit={(formData, setErrorMessage) => {
            sendRequest("POST", "api/register", formData).then((result) => {
              if (result.res.status != 200) {
                if (result.res.status === 500) {
                  setErrorMessage(result.data.message);
                }
                if (result.res.status === 401) {
                  navigate("/login");
                }
              }
            });
          }}
        />

        <Paper
          sx={{
            alignItems: "center",
            visibility: loading ? "hidden" : "visible",
            overflowY: "auto",
            gridRow: "1 / 3",
            gridColumn: "2 / 3",
            pb: 3,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ textAlign: "left", p: 2 }}
          >
            Renginiai
          </Typography>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Icon>
                      <NumbersIcon />
                    </Icon>
                  </TableCell>
                  <TableCell>Renginys</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        ...styles.tableHeaderIconContainer,
                        justifyContent: "flex-start",
                      }}
                    >
                      <Icon>
                        <CalendarMonthIcon />
                      </Icon>
                      Data
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={styles.tableHeaderIconContainer}>
                      <Icon>
                        <PeopleIcon />
                      </Icon>
                      Dalyviai
                    </Box>
                  </TableCell>
                  <TableCell align="right">Veiksmai</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.id}</TableCell>
                    <TableCell>{event.name}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell align="right">{event.attendees}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => {
                          setMembersEventFilter(event.id);
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <MembersContainer
          eventFilter={membersEventFilter}
          setMembersEventFilter={setMembersEventFilter}
          events={events}
        />
        <Backdrop open={loading}>
          <CircularProgress />
        </Backdrop>
      </Box>
    </Box>
  );
}
