const gulp = require("gulp");
const concatenate = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const gulpSASS = require("gulp-sass")(require("sass"));

const sassFiles = [
    "./src/styles/variables.scss",
    "./src/styles/custom.scss",
    "./src/styles/bootstrap/scss/_variables.scss",
];

const vendorJsFiles = [
    "./node_modules/jquery/dist/jquery.js",
    "./src/styles/bootstrap/dist/js/bootstrap.js",
];

gulp.task("sass", (done) => {
    gulp.src(sassFiles)
        .pipe(gulpSASS())
        .pipe(concatenate("styles.css"))
        .pipe(gulp.dest("./public/css"))
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(rename("styles.min.css"))
        .pipe(gulp.dest("./public/css"));
    done();
});

gulp.task("js", (done) => {
    gulp.src(vendorJsFiles)
        .pipe(concatenate("vendor.js"))
        .pipe(gulp.dest("./public/js"))
        .pipe(uglify())
        .pipe(rename("vendor.min.js"))
        .pipe(gulp.dest("./public/js"));
    done();
});

gulp.task("build", gulp.parallel(["sass", "js"]));

gulp.task("watch", (done) => {
    gulp.watch(sassFiles, gulp.series("sass"));
    gulp.watch(vendorJsFiles, gulp.series("js"));
    done();
});

gulp.task("default", gulp.series("watch"));
