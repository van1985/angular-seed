# Angular seed generator
A generator for [Yeoman](http://yeoman.io), and an application skeleton for a typical AngularJS application.  

The seed contains AngularJS libraries, along some AngularJS plugins. It also contains a Gruntfile.js file with a bunch of preconfigured tasks, so you don't have to worry about build, development server or setting up a test runner.

## Creating a bower component
Now the generator allows you to create a bower component instead of a full app.

Keep in mind that this functionality is not fully supported yet, so not all generator are available for a bower component.

```
$ yo globant-angular-seed --bower-component
```

## Getting Started

### What is Yeoman?
If you don't know what Yeoman is, [start here](http://yeoman.io/)

### Installation of the generator

*While the generator is not available in npm:*  

```
$ git clone git@github.com:GlobantMobileStudio/webmobile-basecode.git angularSeed
$ cd angularSeed/
$ git checkout -b angular-seed-master origin/angular-seed-master
$ cd generator-globant-angular-seed/
$ npm link #this will create a symlink to /usr/local/lib/node_modules/ which will make the generator available for yeoman
```

*When the generator is published on npm you'll just run the following instead of cloning it*

```
$ npm install -g generator-globant-angular-seed
```

### Using the generator to create a bower component


```
$ yo globant-angular-seed --bower-component
```

#### You'll be ased the following things:

1. Name of the app (it will be displayed in the bower.json file)
2. Description of the app (it will be displayed in the bower.json file)

### Subgenerators availables for a bower component

1. Feature
2. Controller
3. View
4. Constant
5. Factory
6. Service
7. Values

***

### Using the generator to create an app

```
$ yo globant-angular-seed
```

#### You'll be ased the following things:

1. Name of the app
2. Description of the app (it will be displayed in the package.json file)
3. The base route of the app
4. Optional bower modules you can install:  
	* ngRoute
	* ngResource
	* ngSanitize
	* ngCookies
	* ngAnimate
	* ngTouch
	* ngMock
	* ngLocale
	
#### Suffixes

It's common that all controllers, services, filters and directives have a suffix, to identify them more easily. At the moment, the suffix will always have a abbreviation form (Ctrl, Srv).
This will be configurable when the app is created.

### Using the subgenerator for an app

#### Features
You can create a complete feature by running:

```
$ yo globant-angular-seed:feature feature-name
```

##### You'll be asked the following things:  

1. Name of the route.
2. Name of the main controller. It will be used to create the route configuration.  
3. Name of the main view. It will be used to create the route configuration.    

##### The subgenerator will do the following for you:  

1. Createthe controller and add the script tag into index.html.  
4. Create the view.  
5. Create a module name for the feature and include it in features/app.js (main file in the seed) so the feature will be ready to use.
6. Create the route configuration.

***

#### Controllers

```
$ yo globant-angular-seed:controller controller-name
```

##### You'll be asked the following things:

1. Feature where the controller belongs.

##### The subgenerator will do the following for you:

1. Create the controller and add the script tag into index.html. 

***

#### Views

```
$ yo globant-angular-seed:view view-name
```

##### You'll be asked the following things:

1. Feature where the view belongs.

##### The subgenerator will do the following for you:

1. Create the view. 

***

#### Services

```
$ yo globant-angular-seed:service service-name
```

##### You'll be asked the following things:

1. Feature where the service belongs, if it does.

##### The subgenerator will do the following for you:

1. Create the service and add the script tag into the index.html.  

***

#### Factories

```
$ yo globant-angular-seed:factory factory-name
```

##### You'll be asked the following things:

1. Feature where the factory belongs, if it does.

##### The subgenerator will do the following for you:

1. Create the factory and add the script tag into the index.html.  

***

#### Providers

```
$ yo globant-angular-seed:provider provdier-name
```

##### You'll be asked the following things:

1. Feature where the provider belongs, if it does.

##### The subgenerator will do the following for you:

1. Create the provider and add the script tag into the index.html.  

***

#### Constants

```
$ yo globant-angular-seed:constant constant-name
```

##### You'll be asked the following things:

1. Feature where the constant belongs, if it does.

##### The subgenerator will do the following for you:

1. Create the constant and add the script tag into the index.html.  

***

#### Values

```
$ yo globant-angular-value value-name
```

##### You'll be asked the following things:

1. Feature where the value belongs, if it does.
2. The value to return

##### The subgenerator will do the following for you:

1. Create the value and add the script tag into the index.html.  

***

#### Directives

```
$ yo globant-angular-seed:directive directive-name
```

##### You'll be asked the following things:

1. If you want to create a separate template file.  
2. Specify the restrict option.  

##### The subgenerator will do the following for you:

1. Create directive file and add the script tag into index.html.   
2. Create the template file if required.  

***

#### Filters

```
$ yo globant-angular-filter filter-name
```

##### The subgenerator will do the following for you:

1. Create the filter and add the script tag into index.html. 

***

### How to run the seed

```
$ grunt server # it'll open a browser pointing to http://localhost:9000/

mockey will be open automatically, if you need mockey without the server you can do:
grunt run-mockey


```

### How to run unit tests

```
$ grunt run-unit
```

### How to run e2e tests
```
grunt run-e2e # it'll open a browser poiting to http://localhost:9876/
```

### How to run the build
```
$ grunt build # it'll create a dist/ directory  
$ grunt server:dist # it'll create a dist/ directory and open a browser poiting to http://localhost:9010 serving dist/ directory
```

## Documentation
[https://github.com/GlobantMobileStudio/webmobile-basecode/wiki/Angular-Seed---Wiki-Home-Page](https://github.com/GlobantMobileStudio/webmobile-basecode/wiki/Angular-Seed---Wiki-Home-Page)

## Troubleshooting

### 1. Circular dependency

If you see the following error, please make sure you've got angular > 1.2.12. 

```
Error: Unknown provider: $sceProvider <- $sce <- $route <- ngViewDirective
```

If you have an older version, update angular manually by doing this:

```
$ bower install angular#~1.1.12 --save
```

## Examples
[The Beatles!](https://github.com/GlobantMobileStudio/webmobile-examples/tree/angular-seed-examples-master)
