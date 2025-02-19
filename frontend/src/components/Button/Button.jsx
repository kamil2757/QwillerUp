import styles from "./Button.module.scss";

function Button({
  children,
  onClick,
  width = undefined,
  format = 1,
  padding,
  blocked = false,
}) {
  return (
    <>
      {!blocked && (
        <div
          className={
            format == 1
              ? styles.button1
              : format == 2
              ? styles.button2
              : styles.button3
          }
          style={
            width ? { width, padding: 0 } : { padding: padding || "0 120px" }
          }
          onClick={onClick ? () => onClick() : null}
        >
          {children}
        </div>
      )}

      {blocked && (
        <div
          className={`${styles.blocked_button} ${
            format == 1
              ? styles.button1
              : format == 2
              ? styles.button2
              : styles.button3
          }`}
          style={
            width ? { width, padding: 0 } : { padding: padding || "0 120px" }
          }
        >
          {children}
        </div>
      )}
    </>
  );
}

export default Button;
