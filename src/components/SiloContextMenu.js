import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Delete, PropaneSharp, Sensors } from "@mui/icons-material";

export default function SiloContextMenu(props) {
  const renderMenu = () => {
    switch (props.type) {
      case "silo":
        return (
          <MenuItem onClick={() => props.clickHandler("create", null)}>
            <ListItemIcon>
              <Sensors fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Sensor</ListItemText>
          </MenuItem>
        );
      case "sensor":
        return (
          <MenuItem
            onClick={() => props.clickHandler("delete", props.clickedId)}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Sensor</ListItemText>
          </MenuItem>
        );
      default:
        break;
    }
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        width: 200,
        maxWidth: "100%",
        display: props.display,
        zIndex: 1,
        top: props.top,
        left: props.left,
      }}
    >
      <MenuList>
        {renderMenu()}
        {/* <MenuItem>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘V
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem> */}
      </MenuList>
    </Paper>
  );
}
