"use strict";

module.exports = {
  error: (msg, meta) => console.error(msg, meta || ""),
  warn:  (msg, meta) => console.warn(msg, meta || ""),
  info:  (msg, meta) => console.info(msg, meta || ""),
  debug: (msg, meta) => console.debug(msg, meta || "")
};

