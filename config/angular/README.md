# Intellij IDEA codestyle configuration

To apply common codestyling please, import codestyle xml files into intellij idea
codestyle configuration sections.

## Configuration

##### TypeScript:

* Go to Preferences > Code Style > TypeScript;
* Select current project [should be selected by default];
* Under cogwheel icon at the right of the project selection field select “Import Scheme”;
* Under options select "Intel IDEA code style XML";
* select "\config\angular\typescript.xml"
* Apply changes.

## Code styling

##### TSLint configuration for Intellij IDEA

To be able to use lintage at real-time upon a development process follow next instructions:

* Go to Language & Frameworks > TypeScript > TSLint
* Check “Enable” checkbox
* Under node interpreter provide path to node executable. If node is installed globally filed will be filled automatically.
* Under “TSLint package” field provide path to tslint package. It should be something like this if you are not using global installation:
<path-to-project>/gulp-web-parent/gulp-frontend/node_modules/tslint.
* For multiple available configuration provide the exact one you need under “Configuration file” field previously checking the checkbox. By default “Search for tslint.json” option will be checked.