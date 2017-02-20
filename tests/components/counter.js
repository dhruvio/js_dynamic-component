"use strict";

function component (h, log) {

  function init () {
    log.info("init");
    return {
      counter: 0,
      lastFrame: 0
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
      const elapsed = data.frame - state.get('lastFrame');
      const fps = 1000 / elapsed;
      log.debug("animationFrame", { fps });
      return state.set('lastFrame', data.frame);
    }

  };

  const effects = [
    require("../../effects/animation-frame")("animationFrame")
  ];

  function render (state, update) {
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
