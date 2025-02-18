import styles from "./Button.module.scss";

function Button({ children, onClick, width = null, format = 1, padding, }) {
  return (
    <div
      className={format == 1 ? styles.button1 : format == 2 ? styles.button2 : styles.button3}
      style={width ? { width, padding: 0} : {padding: padding || '0 120px'}}
      onClick={onClick ? () => onClick() : null}
    >
      {children}
    </div>
  );
}

export default Button;
