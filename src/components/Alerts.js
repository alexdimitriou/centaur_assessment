import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import AlertContext from "../modules/AlertsContextProvider";

export default function Alerts() {
  const alerts = React.useContext(AlertContext);

  return (
    <Box sx={{ position: "absolute", bottom: 50, right: 50 }}>
      <Collapse in={alerts.open}>
        <Alert
          severity={alerts.alert}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                alerts.setOpen(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alerts.alertText}
        </Alert>
      </Collapse>
      {/* <Button
        disabled={alerts.open}
        variant="outlined"
        onClick={() => {
          alerts.setOpen(true);
          setTimeout(() => {
            alerts.CollapseetOpen(false);
          }, 3000);
        }}
      >
        Re-open
      </Button> */}
    </Box>
  );
}
