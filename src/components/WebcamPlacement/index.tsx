import React, { useEffect, useState } from "react";

import styles from "./WebcamPlacement.module.css";
import { useMousemove } from "../../hooks/mouseEvents";

type WebcamPlacementProps = {
  radius: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
};

function WebcamPlacement({ radius, canvasRef }: WebcamPlacementProps) {
  const [mousedown, setMousedown] = useState(false);
  const initialDy = window.innerHeight - 2 * radius;
  const [dx, dy, setPos] = useMousemove(mousedown, 0, initialDy);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas !== null) {
      const ctx = canvas.getContext("2d");
      canvas.width = 2 * radius;
      canvas.height = 2 * radius;

      if (ctx !== null) {
        ctx.fillStyle = "#222";
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "18px Helvetica Neue";
        ctx.textAlign = "center";
        ctx.fillText("Adjust Position", radius, radius + 10);
      }
    }
  }, [radius, canvasRef]);

  return (
    <canvas
      className={styles.canvas}
      style={{
        transform: `translate(${dx}px, ${dy}px)`,
      }}
      ref={canvasRef}
      onMouseDown={(e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setMousedown(true);
        setPos([offsetX, offsetY]);
      }}
      onMouseUp={() => setMousedown(false)}
    ></canvas>
  );
}

export default WebcamPlacement;
