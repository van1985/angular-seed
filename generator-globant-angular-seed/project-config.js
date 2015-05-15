exports.FEATURE = {
    DIRECTORIES: [
        'controllers',
        'services',
        'views'
    ]
};

exports.MARKERS = {
    FEATURE: '<!-- yo:features -->',
    CONTROLLER: '<!-- yo:controllers -->',
    SERVICE: '<!-- yo:services -->',
    FILTER: '<!-- yo:filters -->',
    DIRECTIVE: '<!-- yo:directives -->',
    CSS: '<!-- yo:css -->',
    NG_MAIN_MODULES: '// yo:ngMainModules',
    NG_ROUTES: '// yo:ngRoutes',
    SASS: '// yo:includeSass'
};

// script indentation used to insert lines in scripts (default to 4 spaces)
exports.SCRIPT_INDENTATION = '    ';

exports.OPTIONAL_BOWER_COMPONENTS = [
    { name: 'ngRoute', value: 'angular-route', version: '~1.2.12', checked: true },
    { name: 'ngResource', value: 'angular-resource', version: '~1.2.13' },
    { name: 'ngSanitize', value: 'angular-sanitize', version: '~1.2.13' },
    { name: 'ngCookies', value: 'angular-cookies', version: '~1.2.13' },
    { name: 'ngAnimate', value: 'angular-animate', version: '~1.2.13' },
    { name: 'ngTouch', value: 'angular-touch', version: '~1.2.13', checked: true },
    { name: 'ngMock', value: 'angular-mocks', version: '~1.2.13' },
    { name: 'ngLocale', value: 'angular-i18n', version: '~1.2.13' }
];

exports.SUFFIXES = {
    FEATURE:{
        controller: 'Ctrl'
    },
    CONTROLLER: 'Ctrl',
    SERVICE: 'Srv',
    PROVIDER: 'Srv',
    FACTORY: 'Factory',
    VALUE: '',
    CONSTANT: '',
    FILTER: 'Filter',
    DIRECTIVE: ''
};