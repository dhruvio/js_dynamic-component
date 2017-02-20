"use strict";

function component (h, log) {

  function init () {
    log.info("init");
    return {
      counter: 0
    };
  }

  const actions = {
    
    increment: function (state) {
      return state.set("counter", state.get("counter") + 1);
    },

    decrement: function (state) {
      return state.set("counter", state.get("counter") - 1);
    },

    animationFrame: function (state, data) {
      log.debug("animationFrame", data);
      return state
    }

  };

  const effects = [
    require("../../effects/animation-frame")
  ];

  function render (update, state) {
    log.info("render", state);
    return h("section", [
      h("button", {
        "ev-click": () => update("decrement")
      }, ["-"]),
      state.counter,
      h("button", {
        "ev-click": () => update("increment")
      }, ["+"])
    ]);
  }

  return {
    init,
    actions,
    effects,
    render
  };

};

component.id = "counter";

module.exports = component;
