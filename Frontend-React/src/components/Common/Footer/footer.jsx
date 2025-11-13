import React from "react";
import "./styles.css";

import GitHubIcon from '@mui/icons-material/GitHub';

function Footer() {
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  return (
    <div className="footer">
      <h2 className="logo" onClick={() => topFunction()}>
        CryptoInsightHub<span>.</span>
      </h2>
      <div className="social-links">
        <a href="https://github.com/EscapedDhruvdeveloper/CryptoInsightHub.git">
          <GitHubIcon className="social-link" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
