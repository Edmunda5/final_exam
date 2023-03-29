import {
  FormControl,
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IEvent } from "../../typings/events";
import { IMember } from "../../typings/members";
import { sendRequest } from "../../utils/sendRequest";

interface IFormState {
  firstName: string;
  lastName: string;
  email: string;
  dob: number | string;
  event: number | null;
}

interface IProps {
  events: IEvent[];
  onSubmit: (formData:IFormState, setErrorMessage: (message:string) => void) => void;
  memberData?: IMember;
}

export const RegistrationForm: React.FC<IProps> = ({ events, onSubmit, memberData }) => {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [formData, setFormData] = useState<IFormState>({
    firstName: "",
    lastName: "",
    email: "",
    dob: 0,
    event: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    console.log("memberData", memberData)
    setFormData({
      ...formData,
      firstName: memberData?.firstName || "",
      lastName: memberData?.lastName || "",
      email: memberData?.email || "",
      dob: memberData?.dobUnix || 0,
      event: memberData?.event || null,
    })
    
    return () => {
      
    }
  }, [memberData])
  

  return (
    <Paper sx={{ p: 2, width: "100%", boxSizing: "border-box" }}>
      <Typography
        variant="h6"
        component="div"
        sx={{ textAlign: "left", pb: 2 }}
      >
        Dalyvio registracija
      </Typography>
      <Divider />
      {errorMessage ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      ) : (
        ""
      )}
      <FormControl
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} item>
            <TextField
              fullWidth
              value={formData.firstName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  firstName: e.target.value,
                });
              }}
              id="first-name"
              label="Vardas"
              variant="standard"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              fullWidth
              value={formData.lastName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  lastName: e.target.value,
                });
              }}
              id="last-name"
              label="Pavardė"
              variant="standard"
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              fullWidth
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });
              }}
              id="email"
              label="El. paštas"
              variant="standard"
            />
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid xs={12} sm={6} item>
            <FormControl sx={{ width: "100%" }}>
              <DatePicker
                label="Gimimo data"
                value={dayjs.unix(formData.dob as number)}
                onChange={(newValue) => {
                  // @ts-ignore
                  console.log(newValue.unix(), dayjs.unix());
                  setFormData({
                    ...formData,
                    // @ts-ignore
                    dob: newValue.unix(),
                  });
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Renginys</InputLabel>
              <Select
                fullWidth
                label="Renginys"
                value={formData.event}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    event: e.target.value as number,
                  });
                }}
              >
                {events.map((e: IEvent) => (
                  <MenuItem value={e.id}>{e.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          onClick={() => {
            onSubmit(formData, setErrorMessage);
          }}
          variant="outlined"
        >
          Registruoti
        </Button>
      </FormControl>
    </Paper>
  );
};
