import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Box,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import AlertContext from "../modules/AlertsContextProvider";

export default function FormDialog(props) {
  const alerts = React.useContext(AlertContext);
  const [temperatureHistory, setTemperatureHistory] = React.useState([]);

  React.useEffect(() => {
    if (props.open) {
      setTemperatureHistory(props.temperatures);
    }
  }, [props.open, props.temperatures]);

  const addNewTemperature = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setTemperatureHistory(
      temperatureHistory.concat([
        {
          sensorId: props.clickedId,
          temperature: data.get("temperature"),
          timestamp: data.get("timestamp"),
        },
      ])
    );
  };

  const handleClose = () => {
    setTemperatureHistory([]);
    props.handleClose(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchUpdateTemperatures();
    props.handleClose(false);
  };

  const fetchUpdateTemperatures = () => {
    fetch("http://localhost:3001/sensors/" + props.clickedId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("centaur_token"),
      },
      body: JSON.stringify({
        temperatureHistory: temperatureHistory,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            alerts.error("You must be logged in to access this resource!");
            setTimeout(() => {
              window.location.replace("http://localhost:3000/login");
            }, 2000);
            throw new Error(text);
          });
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setTemperatureHistory(data.temperatureHistory);
        alerts.success("Temperatures updated successfully");
      })
      .catch((error) => {
        alerts.error("Error while updating temperatures");
      });
  };

  return (
    <Dialog open={props.open}>
      <DialogTitle>Add temperature</DialogTitle>
      <Container>ID: {props.clickedId}</Container>
      <Container>
        Position: x: {props.position.x} y: {props.position.y}
      </Container>
      <DialogContent>
        <TableContainer
          sx={{
            height: 300,
            display: "flex !important",
            flexDirection:
              temperatureHistory.length >= 5
                ? "column-reverse !important"
                : "column",
          }}
          component={Paper}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 400,
              overflow: "scroll",
            }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Sensor ID</TableCell>
                <TableCell>Temperature value</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temperatureHistory.map((row, i) => (
                <TableRow key={"sensor_data_row_" + i}>
                  <TableCell>{row.sensorId}</TableCell>
                  <TableCell>{row.temperature}</TableCell>
                  <TableCell>{row.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Divider style={{ marginTop: 20, marginBottom: 20 }} />
        <Container style={{ display: "flex", flexDirection: "column" }}>
          <Box component="form" onSubmit={addNewTemperature} sx={{ m: 1 }}>
            <TextField
              id="temperature"
              name="temperature"
              label="temperature"
              InputLabelProps={{
                shrink: true,
              }}
              type="number"
              required={true}
              sx={{ m: 1 }}
            />
            <TextField
              id="timestamp"
              name="timestamp"
              label="Timestamp"
              type="datetime-local"
              InputLabelProps={{
                shrink: true,
              }}
              required={true}
              sx={{ m: 1 }}
            />
            <Button
              variant="contained"
              size="medium"
              color="success"
              startIcon={<AddIcon />}
              sx={{ m: 1 }}
              type="submit"
            >
              Add
            </Button>
          </Box>
        </Container>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose()}>Cancel</Button>
        <Button onClick={handleSubmit}>Update sensor</Button>
      </DialogActions>
    </Dialog>
  );
}
