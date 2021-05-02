import React, { useEffect, useState, useCallback } from "react";

type useMousemoveReturnType = [
  number,
  number,
  React.Dispatch<React.SetStateAction<[number, number]>>
];

export function useMousemove(
  mousedown: boolean,
  initialDx: number,
  initialDy: number
): useMousemoveReturnType {
  const [[x, y], setPos] = useState([0, 0]);
  const [[dx, dy], setDelta] = useState([initialDx, initialDy]);

  const handleMousemove = useCallback(
    ({ clientX, clientY }) => {
      if (mousedown) {
        setDelta([clientX - x, clientY - y]);
      }
    },
    [mousedown, x, y]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMousemove);

    return () => window.removeEventListener("mousemove", handleMousemove);
  }, [handleMousemove]);

  return [dx, dy, setPos];
}
