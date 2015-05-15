var yeoman = require('yeoman-generator');
var jf = require('jsonfile');
var util = require('util');
var glbUtils = require('./utils/common');
var log = require('./utils/log');

var Generator = module.exports = function Generator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  this.name = glbUtils.removeSuffix(this.name, this.generatorName);

  var generatorCallingParam = options.namespace.split(':');
  this.generatorName = generatorCallingParam[1]; //yo-globant-seed:xxx -> xxx generatorCallingParam

  this.moduleName = glbUtils.classify(this.name);
  this.featureDir = 'app/scripts/'+glbUtils.filenameFormat(this.name)+'/';

  this.suffix = glbUtils.getSuffix(this.generatorName);
  this.yoConfig = jf.readFileSync('.yogeneratorrc');
  this.isBowerComponent = this.yoConfig.isBowerComponent;

};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.exists = function(haystack){
  haystack = haystack || this.yoConfig[ this.generatorName ] || [];
  var exists =  this._.where(haystack, {value: glbUtils.dasherize(this.name)}).length > 0;

  if( exists ){
    log.error('This '+ this.generatorName +' already exists.');
  }

  return exists;
};

Generator.prototype.save = function save(){
  if( !this.yoConfig[ this.generatorName ] ){
    log.error('This ' + this.generatorName + ' couldn\'t be saved. ');
  }

  this.yoConfig[ this.generatorName ].push({
    name: glbUtils.humanize(this.name),
    value: glbUtils.dasherize(this.name)
  });

  jf.writeFileSync('.yogeneratorrc', this.yoConfig);
};