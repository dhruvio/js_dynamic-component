# dynamic-componet

Minimal functional components for websites. This library is a thin wrapper around `virtual-dom`.


## Motivation

Dynamic Component is a module that simplifies adding dynamic behaviour to HTML pages with JavaScript. It is common for developers to use jQuery to add dynamic elements like carousels or accordions, and for those simple cases, the recommended tool is jQuery. However, for more complicated scenarios, dynamic-component aims to provide an expressive and powerful way to dynamically manipulate HTML by leveraging the virtual-dom library and stateful change propagation.

This library also uses the dom-delegator package to handle global DOM event delegation to ensure virtual-dom's EvHooks work as expected.


### References:

- https://github.com/Matt-Esch/virtual-dom/
- https://github.com/Raynos/dom-delegator


## Example usage

```javascript
// a simple dynamic component that queries giphy for a random gif
// when a button is clicked

// import dynamic-componet and set up the scope
var dc = require("dynamic-component");
var $ = require("jquery");
// create the state mutator that will dynamically update the DOM
var stateMutator = dc.createState({ url: null });
// query the DOM for the element to contain the dynamic behaviour
var element = document.querySelector("#container");

// set up the render function
// this uses virtual-dom's virtual-hyperscript function, h
function render (state) {
  var h = dc.h;
  return h("div", [
    h("img", {
      attributes: {
        src: state.url
      }
    }),
    h("button", {
      "ev-click": function (event) {
         $.get("https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats")
          .then(function (json) {
            stateMutator.set({ url: json.data.image_url });
          });
      }
    }, ["click me!"])
  ]);
}

// bind the state and the render function to the DOM
dc.bind(stateMutator, render, element);
```


## API

The following table describes the various functions that are part of this package. Functions prefixed by `dc` are part of the object exported from `dynamic-component` directly, while those prefixed by `stateMutator` represent the functions in the object returned by `dc.createState`.

| Function | Type Signature | Description |
|---|---|---|
| `dc.h` | See [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript) | The [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript) function packaged with `virtual-dom`. |
| `dc.createState` | initialState :: Optional Object -><br>stateMutator :: Object | Creates a state mutator. |
| `dc.bind` | stateMutator :: Object -><br>render :: (state :: Object -> vtree :: VTree) -><br>element :: HTMLElement -><br>undefined | Binds a state mutator and render function to an element returned from `document.querySelector`. |
| `stateMutator.get` | -> state :: Object | Returns a deep copy of the state object. |
| `stateMutator.set` | newStateValues :: Object -><br>silent=false :: Boolean -><br>shouldGet=false :: Boolean -><br>state :: Object OR undefined | Update the state, by performing a shallow assign of `newStateValues` to the original state object. Optionally operates silently without triggering a re-render, and optionally returns a deep copy of the new state. |
| `stateMutator.subscribe` | handler :: (state :: Object -> undefined) -><br>unsubscribe :: (-> undefined) | Subscribe to state changes persisted with `stateMutator.set`. Returns a function that unsubscribes the subscription. |


## Links

- [License](LICENSE.txt)
- [Credits](CREDITS.md)


## Author

Dhruv Dang  
[hi@dhruv.io](mailto:hi@dhruv.io)  
[dhruv.io](https://dhruv.io)
