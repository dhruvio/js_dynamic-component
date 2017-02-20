"use strict";

const defaults = require("lodash/defaults");
const defaultLevels = require("./levels/default");

module.exports = create;

function create (prefix = [], levels = defaultLevels, separator = " -> ") {

  if (typeof(levels) !== "object" || levels instanceof Array)
    throw new Error(`logger: invalid levels specified, must be plain object: ${levels}`);

  if (typeof(prefix) !== "string" && !(prefix instanceof Array))
    throw new Error(`logger: invalid prefix, must be a string or array: ${prefix}`);

  // conform prefix to array
  if (typeof(prefix) === "string")
    prefix = [prefix]; 
  
  function logger (level, msg, meta) {
    const log = levels[level];
    if (typeof(level) !== "string")
      throw new Error(`logger: invalid level, must be a string: ${level}`);
    if (typeof(log) !== "function")
      throw new Error(`logger: invalid level, must exist as a function: ${level} -> ${log}`);
    if (typeof(msg) !== "string")
      throw new Error(`logger: invalid msg, must be a string: ${msg}`);
    if (typeof(meta) !== "object")
      throw new Error(`logger: invalid meta, must be an object: ${meta}`);
    log(prefixMsg(msg), meta);
  }

  // add level functions
  Object.keys(levels).forEach(level => {
    logger[level] = function (msg, meta) {
      levels[level](prefixMsg(msg), meta);
    }
  });

  // add create logger composition
  logger.create = function (childPrefix = [], childLevels = {}) {
    // build prefix
    // augment or override levels
    // use parent separator
    return create(prefix.concat(childPrefix), defaults(childLevels, levels), separator); 
  }
  
  return logger;

  // helper to prefix a message
  function prefixMsg (msg) {
    return `${prefix.join(separator) + separator}${msg}`;
  }

}


