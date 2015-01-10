all: clean scripts copy browserify

clean:
	rm -rf dist

scripts:
	6to5 app/scripts --out-dir dist/scripts

browserify:
	browserify dist/scripts/app.js -o dist/scripts/main.js

css:
	mkdir dist/styles | app/node_modules/node-sass/bin/node-sass --output-style compressed app/styles/app.scss dist/styles/app.css

prefix:
	app/node_modules/autoprefixer/bin/autoprefixer -b "last 2 Chrome versions" dist/styles/*.css

copy:
	cp -r node_modules dist/node_modules | cp app/*.html dist

watch:
	fswatch -L node_modules/reactive -0 app node_modules | xargs -0 -n 1 -I {} make

.PHONY: all clean scripts css
