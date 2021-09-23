import { Fab } from "@material-ui/core";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import React, { useEffect, useState } from "react";
import styles from "./style";

export default function ScrollToTop() {
  const classes = styles();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.smoothScroll = () => {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(window.smoothScroll);
        window.scrollTo(0, Math.floor(currentScroll - currentScroll / 5));
      }
    };
    window.addEventListener("scroll", catchScroll);
    return () => window.removeEventListener("scroll", catchScroll);
  }, []);

  const catchScroll = () => {
    setVisible(window.pageYOffset > 100);
  };

  const backToTop = () => {
    window.smoothScroll();
  };

  return (
    visible && (
      <div className={classes.root} onClick={backToTop}>
        <Fab size="medium" color="primary" aria-label="up-arrow">
          <ArrowUpwardIcon />
        </Fab>
      </div>
    )
  )
};