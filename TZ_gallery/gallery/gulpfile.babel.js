import gulp from 'gulp'
import rename from 'gulp-rename'
import flatten from 'gulp-flatten'
import del from 'del'
import postcss from 'gulp-postcss'
import concat from 'gulp-concat'
import newer from 'gulp-newer'
import svgmin from 'gulp-svgmin'
import svgstore from 'gulp-svgstore'
import inject from 'gulp-inject'
import browserSync from 'browser-sync'
import scss from 'postcss-scss'
import nested from 'postcss-nested'
import customMedia from 'postcss-custom-media'
import selector from 'postcss-custom-selectors'
import imagemin from 'gulp-imagemin'
import fileinclude from 'gulp-file-include'
import postcssImport from 'postcss-import'
import plumber from 'gulp-plumber'

const folders = {
  input: 'src',
  output: 'dist',
  uikit: 'uikit',
}

const paths = {
  html: {
    src: `${folders.input}/layout/index.html`,
    watch: `${folders.input}/layout/**/*.html`,
    dest: folders.output
  },
  styles: {
    src: `${folders.input}/layout/**/*.css`,
    watch: [`${folders.input}/layout/**/*.css`, `uikit/*.css`],
    reset: `${folders.uikit}/style-reset.css`,
    dest: `${folders.output}/css`
  },
  js: {
    src: `${folders.input}/layout/**/*.js`,
    dest: `${folders.output}/js`
  },
  img: {
    src: `${folders.input}/assets/img/*.{jpeg,jpg,png,svg}`,
    dest: `${folders.output}/img`
  },
  svg: {
    src: `${folders.input}/assets/img/svg/*.svg`,
    dest: `${folders.output}/img`
  }
}

export const clean = () => del(folders.output)

/*------- HTML -------*/

export function html() {
  const svgs = gulp.src(paths.svg.src)
        .pipe(svgmin())
        .pipe(svgstore({inline: true}))

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  return gulp.src(paths.html.src)
        // .pipe(plumber())
        .pipe(fileinclude({
          prefix: '@',
        }))
        .pipe(inject(svgs, { transform: fileContents }))
        .pipe(gulp.dest(paths.html.dest))
}

/*------- STYLES -------*/

export function styles() {
  return gulp.src(paths.styles.src)
        .pipe(plumber())
        .pipe(postcss([
          postcssImport({
            path: ["src/assets/styles"]
          }),
          nested,
          customMedia,
          selector
        ], { parser: scss }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.styles.dest))
}

/*------- STYLES RESET -------*/

export function reset() {
  return gulp.src(paths.styles.reset)
        .pipe(plumber())
        .pipe(postcss([
          postcssImport,
          nested
        ], { parser: scss }))
        .pipe(newer(`${paths.styles.dest}/reset.css`))
        .pipe(rename('reset.css'))
        .pipe(gulp.dest(paths.styles.dest))
}

/*------- JS -------*/

export function js() {
  return gulp.src(paths.js.src)
        .pipe(plumber())
        .pipe(newer(`${paths.js.dest}/main.js`))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js.dest))
}

/*------- IMAGES -------*/

export function img() {
  return gulp.src(paths.img.src, {since: gulp.lastRun(img)})
        .pipe(flatten())
        .pipe(imagemin())
        .pipe(gulp.dest(paths.img.dest))
}

/*------- WATCH -------*/
export function server() {
  browserSync.init({
    server: 'dist',
    ui: {
      port: 4001
    },
    port: 4001
  });

  browserSync.watch('dist/**/*.*').on('change', browserSync.reload)
}

export function watch() {
  gulp.watch(paths.html.watch, html)
  gulp.watch(paths.styles.watch, styles)
  gulp.watch(paths.js.src, js)
  gulp.watch(paths.img.src, img)
}

export const build = gulp.series(clean, html, styles, reset, js, img, gulp.parallel(watch, server))

export default build
