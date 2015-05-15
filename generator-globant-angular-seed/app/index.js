/*
 * Created with Sublime Text 2.
 * User: song.chen
 * Date: 2014-02-05
 * Time: 21:04:42
 * Contact: song.chen@qunar.com
 */
'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var glbUtils = require('../utils/common');
var config = require('../project-config');
var jf = require('jsonfile');

var GlobantangularseedGenerator = module.exports = function GlobantangularseedGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  var self = this;

  self.isBowerComponent = options['bower-component'];

  this.on('end', function () {
    this.installDependencies({
      skipInstall: options['skip-install'],
      callback: function(){
        if( !self.isBowerComponent ){
          self.spawnCommand('grunt', ['bowerInstall']);
        }
      }
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(GlobantangularseedGenerator, yeoman.generators.Base);

GlobantangularseedGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var generatedType = this.isBowerComponent ? 'component' : 'app';

  var prompts = [
    {
      type: 'input',
      name: 'appName',
      message: 'What do you want to call your '+ generatedType +'?',
      default: path.basename(process.cwd())
    },
    {
      type: 'input',
      name: 'appDescription',
      message: 'What does you '+ generatedType +' do?',
      default: ''
    },
    {
      type: 'input',
      name: 'baseRoute',
      message: 'What is the base route?',
      default: '/',
      when: function(){
        return !this.isBowerComponent;
      }.bind(this)
    },
    {
      type: 'checkbox',
      name: 'bowerComponents',
      message: 'What components do you want to add? (<space> to select)',
      choices: config.OPTIONAL_BOWER_COMPONENTS,
      when: function(){
        return !this.isBowerComponent;
      }.bind(this)
    },
    {
      type: 'confirm',
      name: 'useMockey',
      message: 'Do you want to use mockey?',
      when: function(){
        return !this.isBowerComponent;
      }.bind(this)
    }
  ];

  this.prompt(prompts, function (props) {
    var self = this;
    var isBowerComponentIncluded = function(component){ return props.bowerComponents.indexOf(component) > -1; };
    self.appName = self._.camelize(props.appName);
    self.appDescription = props.appDescription;
    self.useMockey = props.useMockey;
    self.baseRoute = glbUtils.normalizeRoute(props.baseRoute || '');
    self.bowerComponents = [];

    if( !this.isBowerComponent ){
      // iterate over all the possible bower components to see which ones were included by the user.
      config.OPTIONAL_BOWER_COMPONENTS.forEach(function(component){
        // we will make visible to the template only the bower components that have been included by the user by
        // populating the self.bowerComponents array.
        if( isBowerComponentIncluded( component.value ) ){
          component.included = true;
          self.bowerComponents.push( component );
        }

        // save a reference to each component so they can be accessed from the templates, in case we need to render things
        // based on the components being included/excluded.
        self[ component.name ] = component;
      });
    }

    cb();
  }.bind(this));
};

GlobantangularseedGenerator.prototype.askForHybridApp = function askForHybridApp() {
  var cb = this.async();

  var prompts = [
    {
      type: 'confirm',
      name: 'hybridApp',
      message: 'Do you want to crate a hybrid app?',
      default: false,
      when: function(){
        return !this.isBowerComponent;
      }.bind(this)
    }
  ];

  this.prompt(prompts, function (props) {

    var self = this;
    self.hybridApp = props.hybridApp;
    self.enableAppCache = false;
    cb();
  }.bind(this));
};

GlobantangularseedGenerator.prototype.askForEnableAppCache = function askForEnableAppCache() {
  if(!this.hybridApp){

    var cb = this.async();

    var prompts = [
      {
        type: 'confirm',
        name: 'enableAppCache',
        message: 'Do you want to add App Cache ? (Shouldn\'t be included in hybrid apps)',
        default: false,
        when: function(){
          return !this.isBowerComponent;
        }.bind(this)
      }
    ];

    this.prompt(prompts, function (props) {

      var self = this;

      self.enableAppCache = props.enableAppCache;

      cb();
    }.bind(this));
  }
};

GlobantangularseedGenerator.prototype.app = function app() {
  if( this.isBowerComponent ){ return; }

  this.directory('_app', 'app');
  this.template('_app/scripts/app.js', 'app/scripts/app.js');
};

GlobantangularseedGenerator.prototype.createResourceFolders = function createResourceFolders() {
    this.mkdir('app/resources');
    this.mkdir('app/resources/images');
    this.mkdir('app/resources/fonts');
};

GlobantangularseedGenerator.prototype.mockeyfiles = function mockeyfiles() {
  if( this.isBowerComponent ){ return; }
  if( !this.useMockey ){ return; }

  this.directory('_tools', 'tools');
};

GlobantangularseedGenerator.prototype.component = function component(){
  if( !this.isBowerComponent ){ return; }

  this.directory('_component', 'app');
};

GlobantangularseedGenerator.prototype.projectfiles = function projectfiles() {
  var dirFiles = this.isBowerComponent ? '_files-components' : '_files';

  this.directory(dirFiles, '.');
  this.template(dirFiles+'/.yogeneratorrc', '.yogeneratorrc');
};

GlobantangularseedGenerator.prototype.npmComponents = function npmComponents() {
  if( this.isBowerComponent ){ return; }

  this.template('_files/package.json', 'package.json');

};

GlobantangularseedGenerator.prototype.bowerComponents = function bowerComponents() {
  if( this.isBowerComponent ){ return; }

  this.template('_files/bower.json', 'bower.json');

  var self = this;

  this.bowerComponents.forEach(function(component){
    if( component.included ){
      glbUtils.addToFile('app/scripts/app.js', ",'"+component.name+"'", config.MARKERS.NG_MAIN_MODULES, config.SCRIPT_INDENTATION);
    }
  });
};

GlobantangularseedGenerator.prototype.gruntfile = function gruntfile() {
  this.template('_grunt/Gruntfile.js', 'Gruntfile.js');
  this.directory('_grunt/grunt-tasks', 'grunt-tasks');
};


GlobantangularseedGenerator.prototype.githooks = function githooks() {
    this.directory('_grunt/git-hooks', 'git-hooks');
};