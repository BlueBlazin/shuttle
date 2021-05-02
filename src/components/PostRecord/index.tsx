import React from "react";

import styles from "./PostRecord.module.css";

type PostRecordParams = {
  url: string;
};

function PostRecord({ url }: PostRecordParams) {
  function renderVideo() {
    if (url !== "") {
      return <video src={url} controls={true} width={640} height={480}></video>;
    }
  }

  return (
    <div className={styles.container}>
      <div>{renderVideo()}</div>
      <div>
        <a href={url} download="shuttle-capture.mp4">
          Click to download video
        </a>
      </div>
    </div>
  );
}

export default PostRecord;
