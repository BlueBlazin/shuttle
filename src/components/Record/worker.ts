export function canvasLoop() {
  // @ts-ignore
  if (captureCanvas) {
    setTimeout(canvasLoop, 100 / 3);
  }
  // @ts-ignore
  postMessage("DRAW");
}

export function handleWorkerMessage(msg: { data: string }) {
  if (msg.data === "STOP") {
    // @ts-ignore
    captureCanvas = false;
  }

  if (msg.data === "START") {
    canvasLoop();
  }
}
