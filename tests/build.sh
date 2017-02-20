#! /usr/bin/env bash

TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BROWSERIFY="$TESTS_DIR/../node_modules/.bin/browserify"
INPUT_FILE="$TESTS_DIR/index.js"
OUTPUT_FILE="$TESTS_DIR/build.js"

$BROWSERIFY $INPUT_FILE -o $OUTPUT_FILE -t babelify --presets latest
