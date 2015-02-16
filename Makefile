all: clean copy scripts css

clean:
	rm -rf dist

scripts:
	mkdir dist/scripts
	browserify app/scripts/app.js -t babelify --outfile dist/scripts/main.js

css:
	mkdir dist/styles
	node_modules/node-sass/bin/node-sass --output-style compressed app/styles/main.scss dist/styles/main.css

prefix:
	node_modules/autoprefixer/bin/autoprefixer -b "last 2 Chrome versions" dist/styles/*.css

copy:
	mkdir dist
	cp -R app/images dist
	cp app/index.html dist

watch:
	fswatch -L node_modules/reactive -0 app node_modules | xargs -0 -n 1 -I {} make

.PHONY: all clean copy scripts css
