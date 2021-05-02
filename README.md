# Shuttle

A webapp for recording screen and webcam videos.
https://shuttle.surge.sh/

![shuttle screenshot](https://raw.githubusercontent.com/BlueBlazin/shuttle/master/shuttle-screenshot.png)

## Highlights:

- No recording limits
- Runs entirely in the browser (videos aren't sent to any server)
- Free and open source

## Background:

I made this because I've found myself wanting to record screen captures several times. Loom is a great app but its free tier only allows you to record 5 minute videos. I didn't want to pay for it, so I made this instead.

## Technical Info

- The app is written in React + Typescript
- It contains a setTimeout based timer implementation that runs in a Web Worker. I won't claim it's the best way to do this, or even the correct way, but you can use it as a reference for doing this with a CRA app without ejecting.
- Overlaying the webcam on the screen capture is done by drawing both on a canvas element (with the appropriate shape and placement), capturing it with `canvas.captureStream`, and finally recording it with a `MediaRecorder`.
