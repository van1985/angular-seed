var glbUtils = require('./common');
var config = require('../project-config');

var addTagToIndex = function(tag, marker){
    glbUtils.addToFile('app/index.html', tag , marker, '  ');
};

var createScriptTag = function(filename){
    filename = filename.replace('app/', '');
    return '<script src="'+filename+'"></script>';
};

var createCSSTag = function(filename){
    filename = filename.replace('app/', '');
    return '<link rel="stylesheet" href="'+filename+'">';
};

module.exports = {
    controller: function(filename){
        addTagToIndex( createScriptTag(filename), config.MARKERS.CONTROLLER);
    },
    service: function(filename){
        addTagToIndex( createScriptTag(filename), config.MARKERS.SERVICE);
    },
    filter: function(filename){
        addTagToIndex( createScriptTag(filename), config.MARKERS.FILTER);
    },
    directive: function(filename){
        addTagToIndex( createScriptTag(filename), config.MARKERS.DIRECTIVE);
    },
    feature: function(filename){
        addTagToIndex( createScriptTag(filename), config.MARKERS.FEATURE);
    },
    css: function(filename){
        addTagToIndex( createCSSTag(filename), config.MARKERS.CSS);
    }
};