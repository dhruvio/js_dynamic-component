# Changelog

Versions' commits are tagged by their version number.

## 3.0.0

**Please be aware this release contains major, breaking API changes. Review the documentation before upgrading.**

- [enhancement] Use bleeding ECMAScript features supported in Node.
- [enhancement] Re-organization of package to export core parts as separate modules, instead of exporting one large object from the main module.
- [enhancement] API change for the bind function.
- [feature] Add support for *effects*, a convenient way to propagate state updates to and from impure aspects of an application.
- [feature] Add an example effect to update state every animation frame.
- [feature] Add Immutable.js support for state management to emphasie pure, unidirectional data flow. Removed the old, custom state management solution.
- [feature] Add support for *services*, a library of useful modules for front-end development.
- [feature] Add a logger service.

## 2.0.1

- [bugfix] Re-opened state change publishing earlier than previously (by setting `publishQueued = false` earlier) to prevent some state updates from being missed. In particular, updates that would happen while subscription functions were being called were not being published.

## 2.0.0

- Use lodash's shallow `assign` function instead of the recursive `merge` function to improve the general functionality of state management. This means that developers need to be cognizant of shallow state updates.

## 1.0.1

- No code patch, updated description in documentation.

## 1.0.0

- Hello world!
