'use strict';
var util = require('util');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');

var Generator = module.exports = function Generator(args, options, config) {
  BaseGenerator.apply(this, arguments);

  // if this generator is run by the feature generator, we don't need to ask the feature this controller
  // belongs to, as we already know it.
  this.featureBeingCreated = options.featureBeingCreated;

  // if this generator is run by the feature generator, it will send us the controller name via the getName method
  this.name = this.featureBeingCreated ? options.getName() : this.name;
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
    {
      type: 'list',
      name: 'feature',
      message: 'Which feature does this controller belong to?',
      choices: glbUtils.getFeaturesList(),
      when: function(){
        return !this.featureBeingCreated;
      }.bind(this)
    }
  ];

  this.prompt(prompts, function (props) {
    this.feature = props.feature || this.featureBeingCreated;

    this.moduleName = glbUtils.classify(this.feature);
    this.featureName = this._.dasherize(this.feature);
    this.featureDir = 'app/scripts/'+glbUtils.filenameFormat(this.moduleName)+'/';

    !this.exists() && cb();

  }.bind(this));
};

Generator.prototype.saveController = function saveController(){
    this.save();
};

Generator.prototype.files = function files() {
  
    var path = this.featureDir + 'controllers/' + glbUtils.filenameFormat(this.name) + '.js';

    this.name = glbUtils.classify( this.name ) + this.suffix;

    this.template('controller.js', path);

    if( this.isBowerComponent ){ return; }
    addToIndex.controller(path);

};