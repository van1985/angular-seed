'use strict';
var util = require('util');
var config = require('../project-config');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');

var Generator = module.exports = function Generator(args, options, config) {
    BaseGenerator.apply(this, arguments);

    this.moduleName = glbUtils.classify(this.name);

    // add hook to call the controller generator
    this.hookFor('globant-angular-seed', {
    as: 'controller',
    options: {
      options: {
        featureBeingCreated: this.name,
        getName: function(){
          return this.controller;
        }.bind(this)
      }
    }
    });

    // add hook to call the view generator
    this.hookFor('globant-angular-seed', {
    as: 'view',
    options: {
      options: {
        featureBeingCreated: this.name,
        getName: function(){
          return this.view;
        }.bind(this)
      }
    }
    });

    // add hook to call the controller generator
    this.hookFor('globant-angular-seed', {
        as: 'sass',
        options: {
            options: {
                featureBeingCreated: this.name,
                getCreateSass: function(){
                    return this.createSass;
                }.bind(this)
            }
        }
    });
};

util.inherits(Generator, BaseGenerator);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();

  var prompts = [
    {
      type: 'input',
      name: 'route',
      message: 'What\'s the route?',
      default: glbUtils.normalizeRoute(this.name),
      when: function(){
        return !this.isBowerComponent;
      }.bind(this)
    },
    {
      type: 'input',
      name: 'controller',
      message: 'What is the main controller of the feature?',
      default: glbUtils.classify(this.name)
    },
    {
      type: 'input',
      name: 'view',
      message: 'What is the main view of the feature?',
      default: glbUtils.classify(this.name)
    },
    {
      type: 'confirm',
      name: 'createNewSass',
      message: 'Do you want to create a new Sass file for this feature?',
      default: true,
      when: function(){
          return !this.isBowerComponent;
      }.bind(this)
    }
  ];

  this.prompt(prompts, function (props) {
    this.controller = props.controller;
    this.view = props.view;
    this.route = glbUtils.normalizeRoute(props.route || '');
    this.createSass = props.createNewSass;
    !this.exists() && cb();
  }.bind(this));
};

Generator.prototype.saveFeature = function saveFeature(){
  this.save();
};

Generator.prototype.directories = function files() {
  var self = this;

  self.mkdir( this.featureDir );

  config.FEATURE.DIRECTORIES.forEach(function(dir){
    self.mkdir( self.featureDir + dir );
  });
};

Generator.prototype.mainfile = function mainfile(){
  var mainFile = this.featureDir + glbUtils.filenameFormat(this.name) + '.js';
  this.template('index.js', mainFile);

  if( this.isBowerComponent ){ return; }
  
  addToIndex.feature(mainFile);
  glbUtils.addToFile('app/scripts/app.js', ",'"+this.moduleName+"'", config.MARKERS.NG_MAIN_MODULES, config.SCRIPT_INDENTATION);
};

Generator.prototype.route = function route(){
  if( this.isBowerComponent ){ return; }

  var baseSpace = config.SCRIPT_INDENTATION+config.SCRIPT_INDENTATION;

  var route = ""
    +baseSpace+"routes.push({\n"
    +baseSpace+"    name: '"+this.route+"',\n"
    +baseSpace+"    params: {\n"
    +baseSpace+"        templateUrl: 'scripts/"+glbUtils.filenameFormat( this.name )+"/views/"+glbUtils.filenameFormat( this.view )+".html',\n"
    +baseSpace+"        controller: '"+ glbUtils.classify( this.controller ) + this.suffix.controller + "'\n"
    +baseSpace+"    }\n"
    +baseSpace+"});\n"+baseSpace;

  glbUtils.addToFile('app/scripts/app.js', route, config.MARKERS.NG_ROUTES,'');
};