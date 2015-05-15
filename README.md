cd into **generator-globant-angular-seed** to see the generator and its documentation.

## Directory structure of the generator project

### app 

#### index.js

Main file with all the generator logic

#### templates

Directory with the templates used to create:  

##### templates subdirectories

###### _app

The app directory will we copied to the root of the new project. It the basic structure of the app, where the feature will be created.
Among other things, it contains:  

* index.html
* styles/ directory with some standard files.
* tests/ directory with unit and e2e tests
* scripts/ directory where the app lives. It provides the main file where the app is created and 3 subdirectories:  
-- directives  
-- services  
-- services  

###### _config

The config directory will we copied to the root of the new project. It contains the configuration needed for the different environments.

###### _files

The content of the files directory will be copied to the root of the new project. It contains all the fails needed in at the root of the project. Among others:

* README.md
* packaje.json
* bower.json

###### _grunt

The grunt directory will be copied to the root of the new project. It contains all the grunt tasks and configurations needed.

###### _tools

The tools directory will we copied to the root of the new project. Currently, it only contains mockey.

***

### feature

Location of feature subtask generator

#### index.js

Main file with all the subgenerator logic

#### templates

Directory with the templates used to create:  

* Controllers  
* Filters  
* Services  
* Views  
* Feature main file  

***

### utils

Helpers methods to use in the generator.

#### usage

```
var glbUtils = require('../utils/common');

glbUtils.normalizeRoute();
```