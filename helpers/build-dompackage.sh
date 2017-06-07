#!/bin/bash
# npm install browserify -g
# npm install uglify-es -g
#
file="dompackage"
#if [ "$file" == "" ]; then
#	echo Usage: ./buildpackage.sh PACKAGENAME
#	echo Note: PACKAGENAME must be without .node.js, a .js and a min.js will be made
#	echo Ensure you have browserify and uglify-es installed.
#	exit 0;
#fi 
if ! [ -f $file.node.js ]; then
	echo "Could not find template file $file.node.js"
	exit 1;
fi
echo Browserfying...

# We're using dompackage.node.js as a boilerplate for browserify to do something useful with
browserify $file.node.js -d -o $file.js
echo Adding a wrapper for Threading.js import.


# This needs to be in the thread..
cat dependency.syncDOM.js >> $file.js

# We need to wrap te thread for injection
sed -i '1s/^/self.threadingjs.helpers.push(function\(\)\{\n /' $file.js
echo "});" >> $file.js

# We need these also in the window thread as well.
cat dependency.diffDOM.js >> $file.js
cat dependency.syncDOM.js >> $file.js

# Make it smaller
echo Uglifying...
uglifyjs $file.js  --output $file.min.js

# We're done, show the new files.
echo Done!
ls -lah $file.min.js $file.js
