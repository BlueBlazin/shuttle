import React from "react";
import { BiWebcam } from "react-icons/bi";
import { FiMonitor } from "react-icons/fi";
import cx from "classnames";

import styles from "./RecordPanel.module.css";

type RecordPanelProps = {
  requestCam: boolean;
  requestScreen: boolean;
  toggleCam: () => void;
  toggleScreen: () => void;
  startRecording: () => void;
};

function RecordPanel({
  requestCam,
  requestScreen,
  toggleCam,
  toggleScreen,
  startRecording,
}: RecordPanelProps) {
  const allowStart = requestCam || requestScreen;

  function handleClick() {
    if (allowStart) {
      startRecording();
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.slot}>
        <div
          className={styles.select}
          style={{
            color: requestCam ? "#222" : "#aaa",
          }}
          onClick={toggleCam}
        >
          <BiWebcam size="3em" />
          <h3>Webcam</h3>
        </div>

        <div
          className={styles.select}
          style={{
            color: requestScreen ? "#222" : "#aaa",
          }}
          onClick={toggleScreen}
        >
          <FiMonitor size="3em" />
          <h3>Screen</h3>
        </div>
      </div>
      <div className={styles.slot}>
        <div
          className={cx(styles.startbtn, {
            [styles.clickable]: allowStart,
            [styles.unclickable]: !allowStart,
          })}
          onClick={handleClick}
        >
          Start Recording
        </div>
      </div>
    </div>
  );
}

export default RecordPanel;
