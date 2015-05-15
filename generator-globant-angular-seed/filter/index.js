'use strict';
var util = require('util');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');

var Generator = module.exports = function Generator(args, options, config) {
  BaseGenerator.apply(this, arguments);

  this.moduleName = 'Filters';
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  !this.exists() && cb();
};

Generator.prototype.saveFilter = function(){
    this.save();
};

Generator.prototype.files = function files() {

    var path = 'app/scripts/filters/' + glbUtils.filenameFormat(this.name) + '.js';

    this.name = glbUtils.classify( this.name ) + this.suffix;

    this.template('filter.js', path);

    if( this.isBowerComponent ){ return; }
    addToIndex.filter(path);

};