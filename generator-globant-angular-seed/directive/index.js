'use strict';
var util = require('util');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');

var Generator = module.exports = function Generator(args, options, config) {
  BaseGenerator.apply(this, arguments);

  this.moduleName = 'Directives';
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
    {
      type: 'confirm',
      name: 'createView',
      message: 'Do you want to create a view file for this directive?',
      default: true
    },
    {
      type: 'checkbox',
      name: 'restrict',
      message: 'How do you want to use your directive?',
      choices: [
        { name: 'as an attribute', value: 'A', checked: false },
        { name: 'as a element', value: 'E', checked: true },
        { name: 'as a class', value: 'C', checked: false },
        { name: 'i will decide later', value: 'no-options', checked: false }
      ],
      filter: function(answers){
        // if we get 'no-option' as part of the answers array, we just change it for a empty string
        // so it'll be lost when the array is joined.
        var noOptionIndex = answers.indexOf('no-options');
        if( noOptionIndex > -1 ){
          answers[noOptionIndex] = '';
        }
        return answers;
      },
      validate: function( answers ){
        if( answers.length < 1 ){
          return "You must choose at least one."
        }
        return true;
      }
    }
  ];

  this.prompt(prompts, function (props) {
    this.createView = props.createView || '';

    this.restrict = props.restrict.join('');

    !this.exists() && cb();

  }.bind(this));
};

Generator.prototype.saveFilter = function(){
    this.save();
};

Generator.prototype.createView = function createView(){
  if( !this.createView ){ return false; }

  this.viewName = glbUtils.filenameFormat(this.name);
  var path = 'app/scripts/directives/views/' + this.viewName + '.html';
  this.template('directive-view.html', path);
};

Generator.prototype.files = function files() {

    var path = 'app/scripts/directives/' + glbUtils.filenameFormat(this.name) + '.js';

    this.name = glbUtils.camelize( this.name ) + this.suffix;

    this.template('directive.js', path);

    if( this.isBowerComponent ){ return; }
    addToIndex.directive(path);

};