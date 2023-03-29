import {
  Paper,
  Typography,
  Divider,
  TableContainer,
  Box,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Dialog,
  DialogTitle,
} from "@mui/material";
import NumbersIcon from "@mui/icons-material/Numbers";
import ReplayIcon from "@mui/icons-material/Replay";
import { IMember } from "../../typings/members";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect, useState } from "react";
import { sendRequest } from "../../utils/sendRequest";
import { RegistrationForm } from "./RegistrationForm";
import { IEvent } from "../../typings/events";

interface Props {
  eventFilter: null | number;
  setMembersEventFilter: (eventFilter: null | number) => void;
  events: IEvent[];
}

export const MembersContainer: React.FC<Props> = ({
  eventFilter,
  setMembersEventFilter,
  events,
}) => {
  const [members, setMembers] = useState<IMember[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogMemberId, setEditDialogMemberId] = useState(0);

  useEffect(() => {
    console.log("membersEventFilter");
    sendRequest("POST", "api/members", { eventId: eventFilter }).then(
      (result) => {
        console.log("api/members");
        setMembers(result.data);
      }
    );

    return () => {
      setMembers([]);
    };
  }, [eventFilter]);

  return (
    <Paper sx={{ overflowY: "auto", boxSizing: "border-box", pb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          boxSizing: "border-box",
        }}
      >
        <Typography variant="h6" component="div" sx={{ textAlign: "left" }}>
          Dalyviai
        </Typography>
        <Stack
          sx={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: -1,
            mr: 1,
          }}
        >
          <IconButton
            onClick={() => {
              setMembersEventFilter(null);
            }}
          >
            <ReplayIcon color="primary" />
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              mt: -1,
              fontSize: "x-small",
              textAlign: "center",
              color: "primary.main",
            }}
          >
            Rodyti visus
          </Typography>
        </Stack>
      </Box>
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
              <TableCell>Vardas</TableCell>
              <TableCell>Gimimo data</TableCell>
              <TableCell>Renginys</TableCell>
              <TableCell align="right">Veiksmai</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell>{member.dob}</TableCell>
                <TableCell>
                  {member.eventName} [{member.event}]
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => {
                      sendRequest("DELETE", "api/members", {
                        id: member.id,
                      }).then((result) => {
                        setMembers(members.filter((m) => m.id !== member.id));
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditDialogOpen(true);
                      setEditDialogMemberId(member.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Pakeisti dalyvio duomenis</DialogTitle>
        <RegistrationForm
          events={events}
          onSubmit={(formData, setErrorMessage) => {
            console.log('api/members/update')
            sendRequest("POST", "api/members/update", {...formData, id: editDialogMemberId})
              .then((result) => {
                // setMembers(result.data);
              })
              .catch((err) => {
                setErrorMessage('Klaida, bandykite dar kartą');
              });
          }}
          memberData={members.find((e) => e.id == editDialogMemberId)}
        />
      </Dialog>
    </Paper>
  );
};
