'use strict';

var _mainModules = [
    'Services'
    ,'Filters'
    ,'Directives'
    ,'AppConfig'
    // yo:ngMainModules
];

<%
// We check if the user included ngRoute in the app and we include the $routeProvider configuration
// only when the user included it.
%>
angular.module('<%= appName %>', _mainModules )
    .config( function(<%= ngRoute.included ? '$routeProvider':'' %>){
        <% if(ngRoute.included) { %>//redirect any invalid hash to /home
        $routeProvider.otherwise({
            redirectTo: '<%= baseRoute %>'
        });

        var routes = [];

// yo:ngRoutes

        routes.forEach(function(route){
            $routeProvider.when(route.name, route.params);
        });<% } %>
    });
