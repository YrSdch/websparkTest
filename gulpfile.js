
let distFolder = 'dist'
let srcFolder = 'app'
let fs = require('fs')


let {src, dest} = require('gulp'),
		gulp 				= require('gulp'),
		browsersync	= require('browser-sync').create(),
	  fileinclude = require('gulp-file-include'),
	  del 				= require('del'),
	  sass 				= require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  groupMedia 	= require('gulp-group-css-media-queries'),
	  cleanCSS 		= require('gulp-clean-css'),
	  rename 			= require("gulp-rename"),
	  babel 			= require('gulp-babel'),
	  sourcemaps 	= require('gulp-sourcemaps'),
	  imagemin 		= require('gulp-imagemin'),
	  webp 				= require('gulp-webp'),
	  webpHTML 		= require('gulp-webp-html'),
	  prettify 		= require('gulp-html-prettify'),
	  webpcss 		= require("gulp-webpcss"),
	  svgSprite 	= require('gulp-svg-sprite'),
	  ttf2woff2 	= require('gulp-ttf2woff2'),
	  ttf2woff 		= require('gulp-ttf2woff'),
	  fonter 			= require('gulp-fonter'),
	  uglify 			= require('gulp-uglify-es').default;

let path = {
	build: {
		html: `${distFolder}/`,
		css: `${distFolder}/css/`,
		js: `${distFolder}/js/`,
		img: `${distFolder}/images/`,
		fonts: `${distFolder}/fonts/`,
	},
	src: {
		html: [`${srcFolder}/**/*.html`, `!${srcFolder}/_*.html`],
		css: `${srcFolder}/sass/main.sass`,
		js: `${srcFolder}/js/main.js`,
		img: `${srcFolder}/images/**/*.{jpg,png,gif,ico,webp}`,
		fonts: `${srcFolder}/fonts/*.ttf`,
	},
	watch: {
		html: `${srcFolder}/**/*.html`,
		css: `${srcFolder}/sass/**/*.sass`,
		js: `${srcFolder}/js/**/*.js`,
		img: `${srcFolder}/images/**/*.{jpg,png,gif,ico,webp}`,
	},
	clearn:  `./${distFolder}/`,
}


function browserSync(param){
	browsersync.init({
		server: {
			baseDir: `./${distFolder}/`
		},
		port: 3000,
		notify: false
	})
}

function html(){
	return src(path.src.html)
					.pipe(fileinclude({
					  prefix: '@@',
					  basepath: '@file'
					}))
					.pipe(webpHTML())
					.pipe(prettify({indent_char: ' ', indent_size: 2}))
					.pipe(dest(path.build.html))
					.pipe(browsersync.stream())
}

function css(){
	return src(path.src.css)
					.pipe(sourcemaps.init())
					.pipe(sass.sync().on('error', sass.logError))
					.pipe(
							sass({
								outputStyle: 'expanded'
							})
						)
					.pipe(groupMedia())
					.pipe(autoprefixer({
							overrideBrowserslist: ['last 5 versions'],
		          cascade: true
		        }))
					.pipe(webpcss({}))
					.pipe(dest(path.build.css))
					.pipe(cleanCSS())//minify css
					.pipe(sourcemaps.write('../maps'))
					.pipe(rename({//rename css to min.css
					    extname: ".min.css"
					  }))
					.pipe(dest(path.build.css))
					.pipe(browsersync.stream())
}

function js(){
	return src(path.src.js)
					.pipe(sourcemaps.init())
					.pipe(fileinclude({
					  prefix: '@@',
					  basepath: '@file'
					}))
					.pipe(babel())
			    
					.pipe(dest(path.build.js))
					.pipe(uglify())
					.pipe(sourcemaps.write('../maps'))
					.pipe(rename({//rename css to min.css
					    extname: ".min.js"
					  }))
					.pipe(dest(path.build.js))
					.pipe(browsersync.stream())
}

function images(){
	return src(path.src.img)
					.pipe(webp({
							quality: 70
					}))
					.pipe(dest(path.build.img))
					.pipe(src(path.src.img))
					.pipe(imagemin({
							progressive: true,
	    				optimizationLevel: 3,
	    				svgoPlugins: [{removeViewBox: false}],
	    				interlaced: true
						}))
					.pipe(dest(path.build.img))
					.pipe(browsersync.stream())
}
function fonts(){
	src(path.src.fonts)
			.pipe(ttf2woff())
			.pipe(dest(path.build.fonts))
	return src(path.src.fonts)
			.pipe(ttf2woff2())
			.pipe(dest(path.build.fonts))
}

gulp.task('otfTottf', function(){
	return src([`${srcFolder}/fonts/*.otf`])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest(`${srcFolder}/fonts/`))
})

gulp.task('svgSprite', function(){
	return gulp.src([`${srcFolder}/iconsprite/*.svg`])
						.pipe(svgSprite({
							model: {
								stack: {
									sprite: '../icons/icons.svg',
									// example: true
								}
							}
						}))
						.pipe(dest(path.build.img))
})

function fontsStyle(){
	let file_content = fs.readFileSync(`${srcFolder}/sass/_fonts.sass`);
	if (file_content == '') {
		fs.writeFile(`${srcFolder}/sass/_fonts.sass`, '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
			let c_fontname;
				for (var i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
					if (c_fontname != fontname) {
					fs.appendFile(`${srcFolder}/sass/_fonts.sass`, '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}


function cb(){}

function watchFile(param){
	gulp.watch([path.watch.html], html)
	gulp.watch([path.watch.css], css)
	gulp.watch([path.watch.js], js)
	gulp.watch([path.watch.img], images)
}

function clean(){
	return del(path.clearn)
}

let build = gulp.series(clean, gulp.parallel(fonts, images, js, css, html), fontsStyle)
let watch = gulp.parallel(build,watchFile, browserSync)

exports.fontsStyle = fontsStyle
exports.fonts = fonts
exports.images = images
exports.js = js
exports.css = css
exports.build = build
exports.html = html
exports.watch = watch
exports.default = watch