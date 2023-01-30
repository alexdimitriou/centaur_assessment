import { Container } from "@mui/system";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Stage, Layer } from "react-konva";
import SiloShape from "./shapes/SiloShape";
import SiloContextMenu from "./SiloContextMenu";
import SensorShape from "./shapes/SensorShape";
import SensorModal from "./SensorModal";
import AlertContext from "../modules/AlertsContextProvider";
import SensorChart from "./charts/SensorChart";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const Silo = () => {
  const alerts = React.useContext(AlertContext);

  const stageRef = React.useRef({
    current: {
      attrs: {
        width: 0,
        height: 0,
      },
    },
  });

  const siloRef = React.useRef();
  const layerRef = React.useRef();

  const [clickedId, setClickedId] = React.useState(0);
  const [clickedPositionX, setClickedPositionX] = React.useState(0);
  const [clickedPositionY, setClickedPositionY] = React.useState(0);
  const [display, setDisplay] = React.useState("none");
  const [contextMenuType, setContextMenuType] = React.useState("silo");
  const [top, setTop] = React.useState(0);
  const [left, setLeft] = React.useState(0);
  const [sensors, setSensors] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTemperatures, setModalTemperatures] = React.useState([]);
  const [tabValue, setTabValue] = React.useState(0);

  useEffect(() => {
    fetch(
      "http://localhost:3001/sensors?userId=" +
        localStorage.getItem("centaur_user_id"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("centaur_token"),
        },
      }
    )
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
        setSensors(data);
        // alerts.success(`Logged in successfully`);
      })
      .catch((error) => {
        console.log(error);
        // alerts.error("Could not communicate with server!");
      });
  }, [modalOpen, alerts]);

  const contextMenuHandler = (e) => {
    //on right click prevent the defaul behavior
    e.evt.preventDefault();
    var stage = e.target.getStage();

    switch (e.target) {
      case siloRef.current:
        setContextMenuType("silo");
        setDisplay("block");
        setTop(e.evt.clientY);
        setLeft(e.evt.clientX);
        break;
      default:
        setDisplay("none");
        break;
    }

    try {
      if (e.target.parent.attrs.sensorId) {
        setClickedId(e.target.parent.attrs.sensorId);
        setContextMenuType("sensor");
        setDisplay("block");
        setTop(e.evt.clientY);
        setLeft(e.evt.clientX);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const clickHandler = (e) => {
    if (e.evt.button === 0) {
      if (e.target.parent) {
        if (e.target.parent.attrs.sensorId) {
          setClickedId(e.target.parent.attrs.sensorId);
          setClickedPositionX(e.target.parent.attrs.x);
          setClickedPositionY(e.target.parent.attrs.y);
          returnTemperaturesForSensor(e.target.parent.attrs.sensorId);
          handleModal(true);
        }
        setDisplay("none");
      }
    }
  };

  const contextMenuClickHandler = (action, id) => {
    switch (action) {
      case "create":
        fetchCreateSensor(
          id,
          stageRef.current.getRelativePointerPosition().x,
          stageRef.current.getRelativePointerPosition().y
        );
        break;
      case "delete":
        removeSensor(id);
        break;
      default:
        break;
    }
    setDisplay("none");
  };

  const renderSensors = () => {
    return sensors.map((sensor) => (
      <SensorShape
        key={"sensor_" + sensor.id}
        x={sensor.x}
        y={sensor.y}
        id={sensor.id}
        fetchUpdatePosition={fetchUpdatePosition}
      />
    ));
  };

  const removeSensor = (id) => {
    fetchDeleteSensor(id);
    sensors.map((sensor, i) => {
      if (sensor.id === id) {
        var sensorArray = sensors;
        sensorArray.splice(i, 1);
        setSensors(sensorArray);
      }

      return null;
    });
  };

  // const createUniqueSensorId = () => {
  //   var biggestIndex = 0;
  //   sensors.map((sensor) => {
  //     if (sensor.id >= biggestIndex) {
  //       biggestIndex = sensor.id;
  //     }
  //   });

  //   return ++biggestIndex;
  // };

  const handleModal = (action) => {
    setModalOpen(action);
  };

  const returnTemperaturesForSensor = (id) => {
    sensors.map((sensor) => {
      if (sensor.id === id) {
        setModalTemperatures(sensor.temperatureHistory);
      }
      return null;
    });
  };

  const renderTabsForSensorCharts = () => {
    if (sensors.length != 0) {
      return (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="basic tabs example"
            >
              {sensors.map((sensor, i) => (
                <Tab
                  key={"tab-label-" + sensor.id}
                  id={"simple-tab-" + i}
                  aria-controls={"simple-tabpanel-" + i}
                  label={"Sensor " + sensor.id}
                />
              ))}
            </Tabs>
          </Box>
          {sensors.map((sensor, i) => (
            <TabPanel key={"tab-panel-" + i} value={tabValue} index={i}>
              <SensorChart
                key={"chart-" + 1}
                data={sensor.temperatureHistory}
              />
            </TabPanel>
          ))}
        </Box>
      );
    } else return null;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchCreateSensor = (id, x, y) => {
    fetch("http://localhost:3001/sensors/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("centaur_token"),
      },
      body: JSON.stringify({
        id: id,
        x: x,
        y: y,
        temperatureHistory: [],
        userId: localStorage.getItem("centaur_user_id"),
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
        setSensors(
          sensors.concat([
            {
              x: data.x,
              y: data.y,
              id: data.id,
              temperatureHistory: data.temperatureHistory,
            },
          ])
        );
        alerts.success("Sensor created successfully");
      })
      .catch((error) => {
        console.log(error);
        alerts.error("Error while creating user");
      });
  };

  const fetchUpdatePosition = (id, x, y) => {
    fetch("http://localhost:3001/sensors/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("centaur_token"),
      },
      body: JSON.stringify({
        x: x,
        y: y,
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
        var newSensorsArray = sensors;

        sensors.map((sensor, i) => {
          if (sensor.id === data.id) {
            newSensorsArray[i] = sensor;
          }
          return null;
        });

        setSensors(newSensorsArray);

        alerts.success("Position updated successfully");
      })
      .catch((error) => {
        alerts.error("Error while updating position");
      });
  };

  const fetchDeleteSensor = (id) => {
    fetch("http://localhost:3001/sensors/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("centaur_token"),
      },
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
        alerts.success(`Sensor deleted successfully`);
      })
      .catch((error) => {
        alerts.error("Error while deleting sensor");
        console.log(error);
      });
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
      maxWidth="xl"
    >
      <SiloContextMenu
        display={display}
        top={top}
        left={left}
        clickHandler={contextMenuClickHandler}
        type={contextMenuType}
        clickedId={clickedId}
      />
      <SensorModal
        open={modalOpen}
        handleClose={handleModal}
        clickedId={clickedId}
        position={{ x: clickedPositionX, y: clickedPositionY }}
        temperatures={modalTemperatures}
        tabValue={tabValue}
        setTabValue={setTabValue}
      />
      <Stage
        onClick={clickHandler}
        onContextMenu={contextMenuHandler}
        ref={stageRef}
        width={315}
        height={605}
      >
        <Layer ref={layerRef}>
          <SiloShape siloRef={siloRef} />
          {renderSensors()}
        </Layer>
      </Stage>
      <Container>{renderTabsForSensorCharts()}</Container>
    </Container>
  );
};

export default Silo;
