'use strict';
var util = require('util');
var addToIndex = require('../utils/add-to-index');
var glbUtils = require('../utils/common');
var BaseGenerator = require('../BaseGenerator');
var log = require('../utils/log');
var config = require('../project-config');

var Generator = module.exports = function Generator(args, options, config) {
    BaseGenerator.apply(this, arguments);

    // if this generator is run by the feature generator, we don't need to ask the feature this view
    // belongs to, as we already know it.
    this.featureBeingCreated = options.featureBeingCreated;

    // if this generator is run by the feature generator, it will send us the controller name via the getName method
    this.createSass = this.featureBeingCreated ? options.getCreateSass() : true;

    // if this generator is run by the feature generator, it will send us the controller name via the getName method
    this.name = this.featureBeingCreated ? options.featureBeingCreated : this.name;
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
                return !this.isBowerComponent && !this.featureBeingCreated;
            }.bind(this)
        },
        {
            type: 'list',
            name: 'feature',
            message: 'Which feature does this sass file belongs to?',
            choices: glbUtils.getFeaturesList(),
            when: function(props){
                return props.belongsToFeature || this.isBowerComponent;
            }.bind(this)
        }
    ];

    this.prompt(prompts, function (props) {
        this.belongsToFeature = this.featureBeingCreated || props.belongsToFeature || this.isBowerComponent; //if it's bower component, we assume it belongs to a feature

        this.feature = props.feature || this.featureBeingCreated;

        this.moduleName = glbUtils.classify(this.feature);

        !this.exists() && cb();

    }.bind(this));
};


Generator.prototype.addSass = function addSass() {
    if(this.createSass){
        var fileName = glbUtils.filenameFormat(this.name);
        var folder = this.belongsToFeature
                        ? 'modules/' + glbUtils.filenameFormat(this.moduleName) + '/'
                        : '';
        var cssFolder = 'app/styles/' + folder;
        this.mkdir(cssFolder);
        this.write(cssFolder + '/_' + fileName + '.scss', '');
        var importLine = '@import "' + folder + fileName + '";';
        if(this.belongsToFeature) {
            glbUtils.addToFile('app/styles/_modules.scss', importLine, config.MARKERS.SASS, '');
        } else {
            glbUtils.addToFile('app/styles/bundle.scss', importLine, config.MARKERS.SASS, '');
        }
    }
};