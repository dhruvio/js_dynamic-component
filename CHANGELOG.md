# Changelog

Versions' commits are tagged by their version number.

## 2.0.1

- [bugfix] Re-opened state change publishing earlier than previously (by setting `publishQueued = false` earlier) to prevent some state updates from being missed. In particular, updates that would happen while subscription functions were being called were not being published.

## 2.0.0

- Use lodash's shallow `assign` function instead of the recursive `merge` function to improve the general functionality of state management. This means that developers need to be cognizant of shallow state updates.

## 1.0.1

- No code patch, updated description in documentation.

## 1.0.0

- Hello world!
