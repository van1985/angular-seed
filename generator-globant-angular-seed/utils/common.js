var path = require('path');
var fs = require('fs');
var _s = require('underscore.string');
var jf = require('jsonfile');
var config = require('../project-config');

/**
 * Returns true if the index passed is the last index of the array
 * @param  {array}  array 
 * @param  {number}  index 
 * @return {Boolean}
 */
var isLastIndex = function(array, index){
    return index === array.length - 1;
};
exports.isLastIndex = isLastIndex;

exports.addToFile = function(filename,lineToAdd,beforeMarker,spacing){
    try {
        var fullPath = path.join(process.cwd(),filename);
        var fileSrc = fs.readFileSync(fullPath,'utf8');

        var indexOf = fileSrc.indexOf(beforeMarker);
        fileSrc = fileSrc.substring(0,indexOf) + lineToAdd + "\n" + spacing + fileSrc.substring(indexOf);

        fs.writeFileSync(fullPath,fileSrc);

    } catch(e) {
        throw e;
    }
};

/**
 * It returns a normalized version of the route:
 *     It will add a starting slash if it doesn't have it
 *     It will return a dasherized version of the string
 *     If it receives an empty string, it will return /
 * @param  route Route to normalized
 * @return Normalized route
 */
exports.normalizeRoute = function(route){
    if( route.charAt(0) !== '/' ){
        route = '/' + route;
    }

    return _s.dasherize(route);
};

/**
 * It returns a classify version of the string passed as parameter. We cannot use underscore.string classify method
 * directly as it will not return a classified string when a classifed one is passed as parameter.
 * 
 * @example
 * _s.classify('MyClassName') => 'Myclassname'
 * exports.classify('MyClassName') => 'MyClassName'
 * 
 * @param  {string} str String to classify
 * @return {string}     Classified string
 */
exports.classify = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    return _s.classify( _s.dasherize(str) );
};

/**
 * Wrapper for underscore.string#huanize
 * 
 * @example
 * exports.humanize('MyClassName') => 'My class name'
 * 
 * @param  {string} str String to humanize
 * @return {string}     Humanized string
 */
exports.humanize = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    return _s.humanize( str );
};

/**
 * It returns a camelized version of the string passed as parameter. We cannot use underscore.string camelized method
 * directly as it will not return a camelized string when a capitalized one is passed as parameter.
 * 
 * @example
 * _s.camelize('Main-content') => 'MainContent'
 * exports.classify('Main-content') => 'mainContent'
 * 
 * @param  {string} str String to camelize
 * @return {string}     Camelized string
 */
exports.camelize = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    return _s.camelize( exports.dasherize(str) );
};

/**
 * It returns a contantified version of the string passed as parameter.
 * 
 * @example
 * exports.constantify('Main-content') => 'MAIN_CONTENT'
 * 
 * @param  {string} str String to constantify
 * @return {string}     Constanified string
 */
exports.constantify = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    str = _s.underscored(str);
    return str.toUpperCase();
};


/**
 * It returns a dasherized version of the string passed as parameter. underscore.string#dasherize will return a string starting with a dash
 * if the parameter starts with a upper case letter. This wrapper gets rid of that.
 * 
 * @example
 * _s.camelize('MainContent') => '-main-ontent'
 * exports.classify('MainContent') => 'main-content'
 * 
 * @param  {string} str String to dasherize
 * @return {string}     Dasherized string
 */
exports.dasherize = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    var dasherized = _s.dasherize(str);

    //if the original string started with a upper case letter, we will hace a starting dash, so we'll remove it
    if( _s.startsWith(dasherized, '-') ){
        dasherized = dasherized.slice(1);
    }

    return dasherized;
};

/**
 * It takes a string a returns a file name format version of it
 *
 * @example
 *
 * exports.fileNameFormat('my-file-Name') => 'my-file-name'
 * exports.fileNameFormat('myFileName') => 'my-file-name'
 * exports.fileNameFormat('MyFileName') => 'my-file-name'
 * exports.fileNameFormat('my-fileName') => 'my-file-name'
 * 
 * @return {string} file name formatted string
 */
exports.filenameFormat = function(str){
    if( !str ){ return ''; }
    if( typeof str !== 'string' ){ return str; }

    return exports.dasherize(str);
};

exports.getFeaturesList = function(){
    var yoConfig = jf.readFileSync('.yogeneratorrc');
    return yoConfig.feature || [];
};

/**
 * It returns the suffix for controllers, services, filters and so on.
 * Right now, the suffixes are stored in the project-config.js file. In the future, the future will have the 
 * ability to choose the kind of suffix they want, and that will be stored in the .yogeneratorrc file. 
 * When we have that, this method will need to check if we have some suffix's configuration there.
 * 
 * @param  {string} target What we need the suffix for? (controller, service, et cetera)
 * @return {string}        Suffix string
 */
exports.getSuffix = function(target){
    return config.SUFFIXES[ target.toUpperCase() ];
};

/**
 * Normalice the names of controller, services, filters and so by removing any suffix it may have. Then, it will be added
 * based on the current configuration
 * 
 * @param  {string} str    Name that needs the suffix removed
 * @param  {string} target What we need the suffix for? (controller, service, et cetera)
 * @return {string}        Name without suffix
 */
exports.removeSuffix = function(str, target){
    //integrate this with the suffixes config in project-config.js
    var possibleSuffixes = {
        controller: /(ctrl|controller)$/i,
        service: /(srv|service)$/i,
        filter: /(filter)$/i,
        factory: /(factory)$/i
    };

    if( !str || typeof str !== 'string' || !target || !possibleSuffixes[ target ] ){ return str; }

    suffixRegex = possibleSuffixes[ target ];

    str = str.replace( suffixRegex, '' );

    if( _s.endsWith(str, '-') ){
        return str.slice(0,-1);
    }

    return str;
};