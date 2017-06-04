#!/bin/bash
# npm install browserify -g
# npm install uglify-es -g
#

if [ "$1" == "" ]; then
	echo Usage: ./buildpackage.sh PACKAGENAME
	echo Note: PACKAGENAME must be without .node.js, a .js and a min.js will be made
	echo Ensure you have browserify and uglify-es installed.
	exit 0;

fi 
if ! [ -f $1.node.js ]; then
	echo "Could not find template file $1.node.js"
	exit 1;
fi
echo Browserfying...
browserify $1.node.js -d -o $1.js
echo Adding a wrapper for Threading.js import.
sed -i '1s/^/function helper_dompackage\(\)\{\n /' $1.js
echo "}" >> $1.js
echo Uglifying...
uglifyjs $1.js  --output $1.min.js
echo Done!
ls -lah $1.min.js $1.js
