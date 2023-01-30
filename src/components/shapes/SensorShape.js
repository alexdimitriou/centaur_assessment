import React, { useEffect } from "react";
import { PropaneSharp } from "@mui/icons-material";
import { Circle, Path, Group, Arc, Layer, Text, Rect } from "react-konva";

const SensorShape = (props) => {
  const [id, setId] = React.useState(0);
  const [posX, setPosX] = React.useState(0);
  const [posY, setPosY] = React.useState(0);

  const [dragPosX, setDragPosX] = React.useState(0);
  const [dragPosY, setDragPosY] = React.useState(0);
  const [showPos, setShowPos] = React.useState(false);

  useEffect(() => {
    setId(props.id);
    setPosX(props.x);
    setPosY(props.y);
  });

  const handleDragEnd = (e) => {
    setPosX(e.target.x());
    setPosY(e.target.y());
    setShowPos(false);
    props.fetchUpdatePosition(
      props.id,
      Math.round(e.target.x()),
      Math.round(e.target.y())
    );
  };

  const handleDrag = (e) => {
    e.target.y(Math.max(e.target.y(), 65));
    e.target.y(Math.min(e.target.y(), 585));
    e.target.x(Math.max(e.target.x(), 15));
    e.target.x(Math.min(e.target.x(), 285));
    setShowPos(true);
    setDragPosX(e.target.x());
    setDragPosY(e.target.y());
  };

  return (
    <Group
      onDragEnd={handleDragEnd}
      onDragMove={handleDrag}
      x={props.x}
      y={props.y}
      scaleY={0.5}
      scaleX={0.5}
      draggable
      sensorId={id}
    >
      <Circle fill="#000" radius={8} />
      <Arc
        innerRadius={15}
        outerRadius={20}
        fill="#000"
        angle={100}
        rotation={130}
      />
      <Arc
        innerRadius={25}
        outerRadius={30}
        fill="#000"
        angle={100}
        rotation={130}
      />
      <Arc
        innerRadius={15}
        outerRadius={20}
        fill="#000"
        angle={100}
        rotation={-50}
      />
      <Arc
        innerRadius={25}
        outerRadius={30}
        fill="#000"
        angle={100}
        rotation={-50}
      />
      <Text fontSize={35} text={"ID: " + props.id} width={100} x={-40} y={40} />
      <Text
        fontSize={22}
        text={"(" + Math.round(dragPosX) + "," + Math.round(dragPosY) + ")"}
        width={100}
        x={-50}
        y={-50}
        opacity={showPos ? 1 : 0}
      />
      <Rect fill="#000" width={80} height={95} x={-40} y={-25} opacity={0} />
    </Group>
  );
};

export default SensorShape;
