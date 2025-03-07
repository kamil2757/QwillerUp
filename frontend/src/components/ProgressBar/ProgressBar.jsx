import styles from "./ProgressBar.module.scss";

function ProgressBar({ percent, width, color = null, bgc='white' }) {
  if (percent >= 100) {
    percent = 100;
    color = "#F8BC3B";
  }
  return (
    <div className={styles.ProgressBar} style={{ width, backgroundColor: bgc }}>
      <div style={{ width: `${percent}%`, backgroundColor: color || ''}}></div>
    </div>
  );
}

export default ProgressBar;
