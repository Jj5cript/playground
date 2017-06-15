/**
 * Created by Jannik on 15.06.2017.
 */
angular.module('playgroundApp')
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "app.html"
            })
            .when("/projects", {
                templateUrl: "projects.html"
            })
    });