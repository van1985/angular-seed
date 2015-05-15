'use strict';
var util = require('util');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');

var Generator = module.exports = function Generator(args, options, config) {
  BaseGenerator.apply(this, arguments);

  // save a reference of the controller name in this.controllerName as we need it with that name when we 
  // populate the template
  this.controllerName = this.name;
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
    {
      type: 'confirm',
      name: 'belongsToFeature',
      message: 'Does it belong to a feature?',
      default: false,
      when: function(){
        return !this.isBowerComponent
      }.bind(this)
    },
    {
      type: 'list',
      name: 'feature',
      message: 'Which feature does this constant belong to?',
      choices: glbUtils.getFeaturesList(),
      when: function(props){
        return props.belongsToFeature || this.isBowerComponent;
      }.bind(this)
    }
  ];

  this.prompt(prompts, function (props) {
    this.belongsToFeature = props.belongsToFeature || this.isBowerComponent; //if it's bower component, we assume it belongs to a feature
    this.feature = props.feature || '';
    this.value = "'"+props.value+"'" || '';

    this.moduleName = this.belongsToFeature ? glbUtils.classify(this.feature) : 'Services';
    this.featureDir = this.belongsToFeature ? 'app/scripts/'+glbUtils.filenameFormat(this.moduleName)+'/' : 'app/scripts/';

    !this.exists() && cb();

  }.bind(this));
};

Generator.prototype.saveService = function saveService(){
    this.save();
};

Generator.prototype.files = function files() {
  
    var path = this.featureDir + 'services/' + glbUtils.filenameFormat(this.name) + '.js';

    this.name = glbUtils.constantify(this.name);

    this.template('constant.js', path);
    
    if( this.isBowerComponent ){ return; }
    addToIndex.service(path);

};