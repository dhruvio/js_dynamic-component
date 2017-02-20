"use strict";

const document   = require("global/document");
const dc         = require("../");
const h          = require("../h");
const log        = require("../services/logger")("tests");
const components = require("./components");

components.forEach(function (component) {
  const cLog = log.create(component.id);
  dc(document.body, component(h, cLog));
});
