let path = require('./package.json').path;
let fs = require('fs');
let {src, dest} = require('gulp');
	gulp = require('gulp');
	browsersync = require('browser-sync').create();
	fileinclude = require('gulp-file-include');
	del = require('del');
	autoprefixer = require('gulp-autoprefixer');
	gcmq = require('gulp-group-css-media-queries');
	clean_css = require('gulp-clean-css');
	cssimport = require('gulp-cssimport')
	rename = require('gulp-rename');
	notify = require('gulp-notify');
	sourcemaps = require('gulp-sourcemaps');
	plumber = require('gulp-plumber');
	shorthand = require('gulp-shorthand');
	uglify = require('gulp-uglify');
	scss =require('gulp-sass');
	ttf2woff = require('gulp-ttf2woff');
	ttf2woff2 =require('gulp-ttf2woff2');
	imagemin = require('gulp-imagemin');
	cache = require('gulp-cache');
	babel = require('gulp-babel');
	include = require('gulp-include')
	function browserSync(){
		browsersync.init({server:{baseDir: "./dist/"}, port:3000, notify:false, browser: "chrome"})}
	function html(){
		return src(path.src.html)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(fileinclude({prefix: '@@', basepath: '@file'}))
			.pipe(dest(path.build.html))
			.pipe(browsersync.stream())
	}
	function js(){
		return src(path.src.js)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(include({extensions: 'js', hardFail: true, separateInputs: true,}))
		.pipe(babel({presets: ['@babel/env']}))
		.pipe(dest(path.build.js))
		.pipe(uglify({toplevel: true}))
		.pipe(rename({basename:"script", suffix:".min",extname:".js"}))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
	}
	function sass(){
		return src(path.src.sass)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sourcemaps.init())
		.pipe(scss({outputStyle:"expanded", includePath:require('node-bourbon').includePaths}))
		.pipe(gcmq())
		.pipe(shorthand())
		.pipe(autoprefixer({overrideBrowserslist:["last 5 versions"], cascade:true}))
		.pipe(dest(path.build.css))
		.pipe(clean_css({level: {1: {specialComments: 0}}}))
		.pipe(rename({basename:"style", suffix:".min", extname:".css"}))
		.pipe(sourcemaps.write('./'))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
	}
	function fonts(){ 
		src(path.src.fonts)
			.pipe(dest(path.build.fonts))
			.pipe(ttf2woff())
			.pipe(dest(path.build.fonts))
		return src(path.src.fonts)
			.pipe(ttf2woff2())
			.pipe(dest(path.build.fonts))
			.pipe(browsersync.stream())
	}
	function icons(){
		return src(path.src.icon)
			.pipe(dest(path.build.icon))
			.pipe(browsersync.stream())
	}
	function img(){
		return src(path.src.img)
		.pipe(cache(imagemin([imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
					plugins: [
							{removeViewBox: false},
							{cleanupIDs: false}
					]
			})
	])))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
	}
	function libsCss(){
		return src(path.lib.css)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(cssimport())
			.pipe(clean_css({level: {1: {specialComments: 0}}}))
			.pipe(rename({basename:"libs", suffix:".min", extname:".css"}))
			.pipe(dest(path.build.lib))
			.pipe(browsersync.stream())
	}
	function libsJs() {
		return src(path.lib.js)
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(babel({presets: ['@babel/env']}))
			.pipe(include({extensions: 'js', hardFail: true, separateInputs: true,}))
			.pipe(uglify({toplevel: true}))
			.pipe(rename({basename:"libs", suffix:".min",extname:".js"}))
			.pipe(dest(path.build.lib))
			.pipe(browsersync.stream())
	}
	function fontsStyle() {
		let file_content = fs.readFileSync('src/sass/common/_fonts.scss');
		if (file_content == '') {
			fs.writeFile('src/sass/common/_fonts.scss', '', cb);
			return fs.readdir(path.build.fonts, function (err, items) {
				if (items) {
					let c_fontname;
					for (var i = 0; i < items.length; i++) {
						let fontname = items[i].split('.');
						fontname = fontname[0];
						if (c_fontname != fontname) {
							fs.appendFile('src/sass/common/_fonts.scss', 
								'@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
						}
						c_fontname = fontname;
					}
				}
			})
		}
	}
	function cb(){

	}
	function watchFiles(){
		gulp.watch([path.watch.html], html);
		gulp.watch([path.watch.js], js);
		gulp.watch([path.watch.sass], sass);
		gulp.watch([path.watch.img], img);
		gulp.watch([path.watch.fonts], fonts);
		gulp.watch([path.watch.icon], icons);
		gulp.watch([path.watch.libs], libsCss);
		gulp.watch([path.watch.libs], libsJs);
	}
	function clean(){
		return del(path.clean);
	}
	let build = gulp.series(clean, gulp.parallel(html, js, sass, fonts, icons, img, libsCss, libsJs), fontsStyle);
	let watch = gulp.parallel(build, watchFiles, browserSync);
	exports.libsCss = libsCss;
	exports.libsJs = libsJs;
	exports.img = img;
	exports.fontsStyle = fontsStyle;
	exports.fonts = fonts;
	exports.icons = icons;
	exports.sass = sass;
	exports.js = js;
	exports.html = html;
	exports.build = build;
	exports.watch = watch;
	exports.default = watch;