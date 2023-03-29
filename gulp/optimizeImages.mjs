import gulp from 'gulp';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import pngQuant from 'imagemin-pngquant';
import mozJpeg from 'imagemin-mozjpeg';
import svgo from 'imagemin-svgo';
import imgCompress from 'imagemin-jpeg-recompress';

const sprite = () =>
  gulp
      .src('source/img/sprite/*.svg')
      .pipe(svgstore({inlineSvg: true}))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/img'));

const optimizeSvg = () =>
  gulp
      .src('build/img/**/*.svg')
      .pipe(
          imagemin([
            svgo({
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
                {
                  name: 'removeRasterImages',
                  active: true,
                },
                {
                  name: 'removeUselessStrokeAndFill',
                  active: false,
                }],
            })]))
      .pipe(gulp.dest('build/img'));

const optimizeJpg = () =>
  gulp
      .src('build/img/**/*.{jpg,jpeg}')
      .pipe(imagemin([
        imgCompress({
          loops: 4,
          min: 70,
          max: 80,
          quality: 'high'
        }),
        imagemin.gifsicle(),
        imagemin.optipng(),
        imagemin.svgo(),
        mozJpeg({quality: 90, progressive: true})
      ]))
      .pipe(gulp.dest('build/img'));

const optimizePng = () =>
  gulp
      .src('build/img/**/*.png')
      .pipe(
          imagemin([
            pngQuant({
              speed: 1,
              strip: true,
              dithering: 1,
              quality: [0.7, 0.8],
            })]))
      .pipe(gulp.dest('build/img'));

/*
  Optional tasks
  ---------------------------------

  Используйте отличное от дефолтного значение root, если нужно обработать отдельную папку в img,
  а не все изображения в img во всех папках.

  root = '' - по дефолту webp добавляются и обновляются во всех папках в source/img/
  root = 'content/' - webp добавляются и обновляются только в source/img/content/
*/

const createWebp = () => {
  const root = '';
  return gulp
      .src(`source/img/${root}**/*.{png,jpg}`)
      .pipe(webp({quality: 80}))
      .pipe(gulp.dest(`source/img/${root}`));
};

export {sprite, createWebp, optimizeSvg, optimizePng, optimizeJpg};
