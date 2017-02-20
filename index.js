/**
 * @module dynamic-component
 * (c) 2017 Dhruv Dang
 */

"use strict";

const window        = require("global/window");
const isPlainObject = require("lodash/isPlainObject");
const isArray    = require("lodash/isArray");
const isFunction    = require("lodash/isFunction");
const immutable     = require("immutable");
const domDelegator  = require("dom-delegator");
const virtualDOM    = require("virtual-dom");

const log     = require("./services/logger")("dynamic-component");
const h       = virtualDOM.h;
const patch   = virtualDOM.patch;
const diff    = virtualDOM.diff;
const create  = virtualDOM.create;
const Promise = window.Promise;

module.exports = bind;

function bind (element, { init, render, actions, effects }) {
  // set up the dom delegator to delegate DOM events.
  // it's okay to run this multiple times, as DOM delegator
  // ensures it only affects global state once.
  domDelegator();
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
  // create update function, and manage update loop
  const update = startUpdateLoop(actions, effects.concat(apply), state);
  // set up the initial virtual tree and DOM element
  let tree = render(update, state.toJS());
  let root = create(tree);
  // append the component root to the parent element
  element.appendChild(root);
  // effect to persist an updated state to the DOM by re-rendering
  function apply (update, state) {
    const newTree = render(update, state);
    const patches = diff(tree, newTree);
    root = patch(root, patches);
    tree = newTree;
  }
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

function startUpdateLoop (actions = {}, effects = [], state) {
  //TODO
    // need a way to more efficiently batch state changes to effects
    // using a timer seems primitive...
    // possible solution is STM since update actions are pure
  // set up a promise to thread state updates through in order
  let promise = Promise.resolve(state);
  // return the update function accessible to API consumers
  return function update (actionName, data) {
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
                       // disperse the new state to the effects
                       // effects receive a plain JS object, not an immutable Map
                       const jsState = state.toJS();
                       effects.forEach(effect => effect(update, jsState));
                       return state;
                     });
  };
}
