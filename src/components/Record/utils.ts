export const SCREEN_SETTINGS = {
  video: {
    cursor: "always",
  },
  audio: false,
};

export const WEBCAM_SETTINGS = {
  video: true,
  audio: false,
};

export function drawVideoOnCanvas(
  canvas: HTMLCanvasElement,
  screenVideo: HTMLVideoElement,
  webcamVideo: HTMLVideoElement,
  requestCam: boolean,
  requestScreen: boolean
) {
  const ctx = canvas.getContext("2d");

  ctx?.save();

  const width = canvas.width;
  const height = canvas.height;

  if (requestScreen) {
    ctx?.drawImage(screenVideo, 0, 0, width, height);
  }

  if (requestCam) {
    ctx?.beginPath();

    const radius = height / 8;

    ctx?.arc(radius, height - radius, radius, 0, Math.PI * 2, false);

    ctx?.clip();

    const aspectRatio = canvas.width / canvas.height;

    ctx?.drawImage(
      webcamVideo,
      radius * (1 - aspectRatio),
      height - 2 * radius,
      aspectRatio * 2 * radius,
      2 * radius
    );

    ctx?.restore();
  }
}

export function makeVideoElem() {
  const video = document.createElement("video");
  video.autoplay = true;
  return video;
}

export function makeCanvasElem() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  canvas.setAttribute("style", "image-rendering: pixelated;");
  return canvas;
}
