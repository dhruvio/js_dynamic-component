#! /usr/bin/env bash

../node_modules/.bin/browserify example.js -o example.build.js -t babelify --presets latest
