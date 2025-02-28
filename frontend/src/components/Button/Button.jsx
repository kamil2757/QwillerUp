import { useEffect, useState } from "react";
import styles from "./Button.module.scss";

function Button({
  children,
  onClick,
  width = undefined,
  format = 1,
  padding,
  blocked = false,
}) {
  const [padd, setPadd] = useState("0 140px");

  useEffect(() => {
    function handleResize() {
      let btn_pad = "0 140px";
      if (window.innerWidth < 1100 && 700 <= window.innerWidth) {
        btn_pad = "0 80px";
      } else if (window.innerWidth < 700) {
        btn_pad = "0 50px";
      }

      setPadd(btn_pad);
    }

    handleResize()
    window.addEventListener("resize", handleResize);

    return () => {
      return window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!blocked && (
        <button
          className={
            format == 1
              ? styles.button1
              : format == 2
              ? styles.button2
              : styles.button3
          }
          style={width ? { width, padding: 0 } : { padding: padding || padd }}
          onClick={onClick ? () => onClick() : null}
        >
          {children}
        </button>
      )}

      {blocked && (
        <button
          className={`${styles.blocked_button} ${
            format == 1
              ? styles.button1
              : format == 2
              ? styles.button2
              : styles.button3
          }`}
          style={width ? { width, padding: 0 } : { padding: padding || padd }}
          onClick={onClick ? () => onClick() : null} 
          disabled
        >
          {children}
        </button>
      )}
    </>
  );
}

export default Button;
