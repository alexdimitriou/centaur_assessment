import { Shape } from "react-konva";

const SiloShape = (props) => {
  let padding = 2;

  return (
    <Shape
      x={props.x}
      y={props.y}
      sceneFunc={(context, shape) => {
        context.beginPath();
        context.lineTo(0 + padding, 60 + padding);
        context.lineTo(0 + padding, 600 + padding);
        context.lineTo(300 + padding, 600 + padding);
        context.lineTo(300 + padding, 60 + padding);
        context.lineTo(200 + padding, 0 + padding);
        context.lineTo(100 + padding, 0 + padding);
        context.closePath();
        // (!) Konva specific method, it is very important
        context.fillStrokeShape(shape);
      }}
      //   fill="#00D2FF"
      stroke="black"
      strokeWidth={4}
      ref={props.siloRef}
    />
  );
};

export default SiloShape;
