all: clean copy scripts

clean:
	rm -rf dist

scripts:
	mkdir dist/scripts
	browserify app/scripts/app.js -t 6to5ify --outfile dist/scripts/main.js

css:
	mkdir dist/styles
	node_modules/node-sass/bin/node-sass --output-style compressed app/styles/app.scss dist/styles/app.css

prefix:
	node_modules/autoprefixer/bin/autoprefixer -b "last 2 Chrome versions" dist/styles/*.css

copy:
	mkdir dist
	cp app/index.html dist

watch:
	fswatch -L node_modules/reactive -0 app node_modules | xargs -0 -n 1 -I {} make

.PHONY: all clean copy scripts css
