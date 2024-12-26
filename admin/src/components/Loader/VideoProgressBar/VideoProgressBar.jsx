import ProgressBar from 'react-bootstrap/ProgressBar';
import styles from "./VideoProgressBar.module.css"

export function VideoProgressBar({videoUploaded}) {

    return <div className={`${styles.videoProgressBar}`}>
        <ProgressBar animated now={videoUploaded} label={`${videoUploaded}%`} />
    </div>

}

