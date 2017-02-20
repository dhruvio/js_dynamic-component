/**
 * @module dynamic-component
 * (c) 2017 Dhruv Dang
 */

"use strict";

const window        = require("global/window");
const isPlainObject = require("lodash/isPlainObject");
const isArray       = require("lodash/isArray");
const isFunction    = require("lodash/isFunction");
const immutable     = require("immutable");
const dom           = require("./effects/dom");

const log     = require("./services/logger")("dynamic-component");
const h       = require("./h");
const Promise = window.Promise;

module.exports = bind;

function bind (element, { init, render, actions, effects }) {
  // validate component (arguments[1]) type
  if (!isPlainObject(arguments[1]))
    log.error("component must be a plain object", { component: arguments[1] });
  // validate component's function types here
  if (!isFunction(init))
    log.error("component.init must be a function", { init });
  if (!isFunction(render))
    log.error("component.render must be a function", { render });
  if (!isPlainObject(actions))
    log.error("component.actions must be a plain object", { actions });
  if (!isArray(effects))
    log.error("component.effects must be an array", { effects });
  // initialize the component state
  const state = initializeState(init);
  // start application loop
  loop(actions, effects.concat(dom(render, element)), state);
}

function initializeState (init) {
  // create the seed object
  const seed = init();
  // validate the seed object
  if (!isPlainObject(seed))
    return log.error("invalid seed state from init, must be a plain object", { seed });
  // marshall the seed object into an immutable JS map
  return immutable.fromJS(seed);
}

function loop (actions = {}, effects = [], state) {
  //TODO
    // need a way to more efficiently batch state changes to effects
    // using a timer seems primitive...
    // possible solution is STM since update actions are pure

  // set up a promise to thread state updates through in order
  let promise = Promise.resolve(state);
  // helper to run effects
  function runEffects (state) {
    effects.forEach(effect => effect(state, update));
  }
  // set up the update function to persist state updates
  function update (actionName, data) {
    // update the promise state to reflect the latest update
    promise = promise.then(state => {
                       // lookup and validate the action
                       const action = actions[actionName];
                       if (!isFunction(action)) {
                         log.warn("invalid action", { actionName, action });
                         // return unmodified state
                         return state;
                       }
                       // run the action
                       return action(state, data);
                     })
                     .then(state => {
                       //TODO
                         // maybe compare old/new state
                         // if no change, don't propagate to effects?
                       // disperse the new state to the effects
                       runEffects(state);
                       return state;
                     });
  }
  // run the initial round of effects
  runEffects(state);
  // return the update function accessible to API consumers
  return update;
}
