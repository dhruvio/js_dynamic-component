"use strict";

const window = require("global/window");

module.exports = function animationFrame (actionName = "animationFrame") {

  // controlled by subscribe/unsubscribe actions
  let active = false; 
  // controlled by run internally to prevent concurrent frame requests
  let stopped = true; 

  function run (callback) {
    if (stopped) {
      stopped = false;
      window.requestAnimationFrame(frame => {
        if (active) {
          callback(frame);
          next(callback);
        } else {
          stopped = true;
        }
      });
    }
  }

  function subscribe (update) {
    if (!active) {
      active = true;
      run(frame => update("animationFrame", { frame }));
    }
  }

  function unsubscribe () {
    active = false;
  }

  return function (update, state) {
    const shouldSubscribe = true; // boolean value based on state
    if (shouldSubscribe) {
      subscribe(update);
    } else {
      unsubscribe();
    }
  };

};
