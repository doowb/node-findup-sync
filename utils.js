/*!
 * fs-exists-sync (https://github.com/jonschlinkert/fs-exists-sync)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');

var utils = module.exports = {};

utils.exists = function(filepath) {
  try {
    fs.lstatSync(filepath);
    return filepath;
  } catch (err) {}

  if (process.platform === 'linux') {
    return existsInDir(filepath);
  }
  return false;
};

function existsInDir(filepath) {
  filepath = path.resolve(filepath);
  var res = tryReaddir(filepath);
  if (res === null) {
    return false;
  }

  // "filepath" is a directory, an error would be
  // thrown if it doesn't exist. if we're here, it exists
  if (res.path === filepath) {
    return res.path;
  }

  // "fp" is not a directory
  var lower = filepath.toLowerCase();
  var len = res.files.length;
  var idx = -1;

  while (++idx < len) {
    var fp = path.resolve(res.path, res.files[idx]);
    if (filepath === fp || lower === fp) {
      return fp;
    }
    var fpLower = fp.toLowerCase();
    if (filepath === fpLower || lower === fpLower) {
      return fp;
    }
  }

  return false;
}

function tryReaddir(filepath) {
  var ctx = { path: filepath, files: [] };
  try {
    ctx.files = fs.readdirSync(filepath);
    return ctx;
  } catch (err) {}
  try {
    ctx.path = path.dirname(filepath);
    ctx.files = fs.readdirSync(ctx.path);
    return ctx;
  } catch (err) {}
  return null;
}
