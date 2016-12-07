/**
 * @module dynamic-component
 * (c) 2016 Dhruv Dang
 */

"use strict";

var domDelegator  = require("dom-delegator");
var virtualDOM    = require("virtual-dom");
var cloneDeep     = require("lodash/cloneDeep");
var merge         = require("lodash/merge");
var isPlainObject = require("lodash/isPlainObject");
var isFunction    = require("lodash/isFunction");
var noop          = require("lodash/noop");

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
    subscriptions.forEach(function (handler) {
      handler(newState);
    });
    publishQueued = false;
  }

  function queuePublish () {
    if (!publishQueued) {
      window.requestAnimationFrame(publish);
      publishQueued = true;
    }
  }

  return {
    get: get,

    set: function (newValues, silent, shouldGet) {
      merge(state, newValues);
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

return {
  h: h,
  createState: createState,
  bind: bind
};
