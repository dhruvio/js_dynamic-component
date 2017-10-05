/**
 * @module dynamic-component
 * (c) 2016 Dhruv Dang
 */

"use strict";

var domDelegator  = require("dom-delegator");
var virtualDOM    = require("virtual-dom");
var window        = require("global/window");
var cloneDeep     = require("lodash/cloneDeep");
var assign        = require("lodash/assign");
var isPlainObject = require("lodash/isPlainObject");
var isFunction    = require("lodash/isFunction");
var noop          = require("lodash/noop");
var svg           = require("virtual-dom/virtual-hyperscript/svg");

var h      = virtualDOM.h;
var patch  = virtualDOM.patch;
var diff   = virtualDOM.diff;
var create = virtualDOM.create;

function bind (state, render, element) {
  // set up the dom delegator to delegate DOM events.
  // it's okay to run this multiple times, as DOM delegator
  // ensures it only affects global state once.
  domDelegator();

  var tree = render(state.get());
  var root = create(tree);
  element.appendChild(root);

  state.subscribe(apply);

  function apply (newState) {
    var newTree = render(newState);
    var patches = diff(tree, newTree);
    root = patch(root, patches);
    tree = newTree;
  }

  return state;
}

function createState (state) {
  if (!isPlainObject(state)) {
    state = {};
  }

  var subscriptions = [];

  function get () {
    return cloneDeep(state);
  }
    
  var publishQueued = false;

  function publish () {
    var newState = get();
    publishQueued = false;
    subscriptions.forEach(function (handler) {
      handler(newState);
    });
  }

  function queuePublish () {
    if (!publishQueued) {
      nextTick(publish);
      publishQueued = true;
    }
  }

  function nextTick (fn) {
    if (isFunction(window.requestAnimationFrame)) {
      window.requestAnimationFrame(fn);
    } else {
      setTimeout(fn, 0);
    }
  }

  return {
    get: get,

    set: function (newValues, silent, shouldGet) {
      // shallow assign
      assign(state, newValues);
      // emit new state to subscriptions
      if (!silent) {
        queuePublish();
      }
      // return the newState if requested
      if (shouldGet) {
        return get();
      }
    },

    subscribe: function (handler) {
      if (subscriptions.indexOf(handler) === -1 && isFunction(handler)) {
        subscriptions.push(handler);
        var i = subscriptions.length - 1;
        return function unsubscribe () {
          subscriptions.splice(i, 1);
        };
      } else {
        return noop;
      }
    }
  };
}

module.exports = {
  h: h,
  svg: svg,
  createState: createState,
  bind: bind
};
