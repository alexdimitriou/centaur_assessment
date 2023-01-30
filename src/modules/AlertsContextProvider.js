import React, { useState } from "react";

import { AlertStatus } from "../lib/enums";

const AlertContext = React.createContext(null);
AlertContext.displayName = "AlertContext";

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(AlertStatus.Info);
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState(null);

  return (
    <AlertContext.Provider
      value={{
        alert: alert,
        alertText: alertText,
        open: open,
        setOpen: setOpen,
        success: (text, timeout) => {
          setAlertText(text);
          setAlert(AlertStatus.Success);
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, timeout * 1000 || 5000);
        },
        info: (text, timeout) => {
          setAlertText(text);
          setAlert(AlertStatus.Info);
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, timeout * 1000 || 5000);
        },
        warning: (text, timeout) => {
          setAlertText(text);
          setAlert(AlertStatus.Warning);
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, timeout * 1000 || 5000);
        },
        error: (text, timeout) => {
          setAlertText(text);
          setAlert(AlertStatus.Error);
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, timeout * 1000 || 5000);
        },
        clear: () => setOpen(false),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export { AlertProvider };
export default AlertContext;
