'use strict';

angular.module('<%= moduleName %>').directive('<%= name %>', function () {
    return {
        restrict: '<%= restrict %>'<% if (!createView) { %>,
        template: ''<% } else { %>,
        templateUrl: 'scripts/directives/views/<%= viewName %>.html'<% } %>,
        link: function(){

        },
        controller: function(){

        }
    };
});