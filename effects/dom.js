"use strict";

// intended for internal use only

const domDelegator = require("dom-delegator");
const virtualDOM   = require("virtual-dom");
const patch        = virtualDOM.patch;
const diff         = virtualDOM.diff;
const create       = virtualDOM.create;

module.exports = function make (render, element) {

  let tree;
  let root;
  let initialized = false;

  return function effect (update, state) {

    if (!initialized) {
      // set up the dom delegator to delegate DOM events.
      // it's okay to run this multiple times, as DOM delegator
      // ensures it only affects global state once.
      domDelegator();
      // set up the initial virtual tree and DOM element
      tree = render(update, state);
      root = create(tree);
      // append the component root to the parent element
      element.appendChild(root);
      // only run the initialization once
      initialized = true;
    } else {
      // diff and persist changed to the virtual app tree
      const newTree = render(update, state);
      const patches = diff(tree, newTree);
      root = patch(root, patches);
      tree = newTree;
    }
  }
}
