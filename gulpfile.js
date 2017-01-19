var gulp = require('gulp');
var concat   = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifyjs = require('uglify-js');
var minifier = require('gulp-uglify/minifier');
var js_obfuscator = require('gulp-js-obfuscator');
var webserver = require('gulp-webserver');
//var embedTemplates = require('gulp-angular-embed-templates');
var templateCache = require('gulp-angular-templatecache');

var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var vendor_js_libs = [
    './node_modules/angular/angular.js',
    './node_modules/angular-ui-router/release/angular-ui-router.min.js',
    './node_modules/angular-resource/angular-resource.js',
   // './node_modules/angular-storage/dist/angular-storage.js',
    './node_modules/angular-local-storage/dist/angular-local-storage.js',
    './node_modules/angular-validation/dist/angular-validation.js',
    './node_modules/angular-validation/dist/angular-validation-rule.js',
    './custom_modules/angular-sanitize/angular-sanitize.min.js',
    './node_modules/restangular/dist/restangular.min.js',
    './node_modules/lodash/lodash.js',
    './node_modules/jquery/dist/jquery.js',    
    './node_modules/bootstrap/dist/js/bootstrap.js',
    './node_modules/bootstrap-slider/dist/bootstrap-slider.min.js',
    './node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
    './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'
  ];

var vendor_css_libs = [
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
    './node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css'/*,
    './modules/jquery-ui/themes/black-tie/jquery-ui.css',
    './modules/jquery-ui/themes/black-tie/jquery-ui.theme.css'*/
  ];
var vendor_fonts= [
    './node_modules/bootstrap/dist/fonts/*',
  ];

var bundle_fonts= [
    './src/fonts/**/*',
  ];

var bundle_scss = ['./src/scss/*.scss'];


gulp.task('vendor-js-dev', function() {
  return gulp.src(vendor_js_libs).pipe(concat('vendor.js')).pipe(gulp.dest('./src/vendor'));
});

gulp.task('vendor-css-dev', function() {
  return gulp.src(vendor_css_libs).pipe(concat('vendor.css')).pipe(gulp.dest('./src/vendor'));  
});

gulp.task('vendor-fonts-dev', function() {
  return gulp.src(vendor_fonts).pipe(gulp.dest('./src/vendor/fonts'))
});

gulp.task('scss-dev', function(){
  return gulp.src(bundle_scss).pipe(sass()).pipe(concat('bundle.css')).pipe(gulp.dest('./src/styles'));
})



gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: "http://localhost:8000/src/index.html"
        }));
});

gulp.task('watch', function() {
    return gulp.watch(['./src/index.html', './src/partials/**/*.html', './src/styles/*.css', './src/scss/*.scss', './src/scripts/**/*.js']);
});

gulp.task('vendor-js', function() {
  return gulp.src(vendor_js_libs).pipe(concat('vendor.js')).pipe(minifier({}, uglifyjs)).pipe(js_obfuscator({},[])).pipe(gulp.dest('../js'));
});

gulp.task('vendor-css', function() {
  return gulp.src(vendor_css_libs).pipe(concat('vendor.css')).pipe(gulp.dest('../css'));
});

gulp.task('vendor-fonts', function() {
  return gulp.src(vendor_fonts).pipe(gulp.dest('../fonts'))
});

gulp.task('bundle-fonts', function() {
  return gulp.src(bundle_fonts).pipe(gulp.dest('../fonts'))
});

gulp.task('bundle-js', function() {
  //return gulp.src(['./src/scripts/**/*.js']).pipe(embedTemplates()).pipe(concat('bundle.js')).pipe(gulp.dest('../js'));
  return gulp.src(['./src/scripts/**/*.js']).pipe(concat('bundle.js')).pipe(gulp.dest('../js'));
});
gulp.task('bundle-css', function() {
  return gulp.src(['./src/styles/*.*css']).pipe(concat('bundle.css')).pipe(gulp.dest('../css'));  
});

gulp.task('scss', function(){
  return gulp.src(bundle_scss).pipe(sass()).pipe(concat('bundle.css')).pipe(gulp.dest('../css'));
})

gulp.task('bundle-html', function() {
  return gulp.src(['./src/partials/**/*.html']).pipe(gulp.dest('../partials'));
  //return gulp.src(['./src/partials/**/*.html']).pipe(templateCache('templateCache.js', { module:'templateCache', standalone:true })).pipe(gulp.dest('../partials'));
});

gulp.task('dev', ['vendor-js-dev', 'vendor-css-dev', 'vendor-fonts-dev', 'scss-dev', 'watch', 'webserver']);

gulp.task('prod', ['vendor-js', 'vendor-css', 'vendor-fonts', 'bundle-fonts', 'bundle-js', 'scss', 'bundle-css', 'bundle-html'])