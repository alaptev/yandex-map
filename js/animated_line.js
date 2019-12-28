"use strict";

ymaps.modules.define('AnimatedLine', [
  'util.defineClass',
  'Polyline',
  'vow'
], function(provide, defineClass, Polyline, vow) {
  /**
   * @fileOverview Анимированная линия.
   */
  /**
   * Создает экземпляр анимированной линии.
   * @class AnimatedLine. Представляет собой геообъект с геометрией geometry.LineString.
   * @param {Boolean} [options.animationTime = 4000] Длительность анимации.
   **/
  // Конструктор класса
  function AnimatedLine(GpsDataSet, properties, options) {
    console.log('---log---  AnimatedLine() ')
    AnimatedLine.superclass.constructor.call(this, GpsDataSet, properties, options);
    // this._loopTime = 50;

    const startTime = Date.parse(GpsDataSet[0][2])
    console.log('---log--- startTime = ', startTime)
    const finishTime = Date.parse(GpsDataSet[GpsDataSet.length-1][2])
    console.log('---log--- finishTime = ', finishTime)
    this._animationTime =  finishTime - startTime;
    console.log('---log--- this._animationTime = ', this._animationTime)

    // Вычислим длину ВСЕЙ переданной линии.
    // let wholeDistance = 0;
    // let previousElem = GpsDataSet[0];
    // this.geometry.getCoordinates().forEach(function(elem) {
    //   wholeDistance += getDistance(elem, previousElem);
    //   previousElem = elem;
    // });
    // Вычислим минимальный интервал отрисовки.
    // this._minAnimationDistance = wholeDistance / this._animationTime * this._loopTime;
    // Создадим массив с более частым расположением промежуточных точек.
    // this._smoothCoords = generateSmoothCoords(GpsDataSet, this._minAnimationDistance);
    this._smoothCoords = GpsDataSet
  }

  defineClass(AnimatedLine, Polyline, {
    // Анимировать линию.
    _start: function() {
      console.log('---log--- _start()')
      let index = 0;
      const coords = this._smoothCoords;
      let line = this;
      // const loopTime = this._loopTime;
      // Будем добавлять по одной точке каждые 'loopTime' мс.
      // function loopOld(index, currentTime, previousTime) {
      //   if (index < coords.length) {
      //     if (!currentTime || (currentTime - previousTime) > loopTime) {
      //       console.log('---log--- set coords['+index+'] = ', coords[index])
      //       line.geometry.set(index, coords[index]);
      //       index++;
      //       previousTime = currentTime;
      //     }
      //     requestAnimationFrame(function(time) {
      //       loop(index, time, previousTime || time)
      //     });
      //   } else {
      //     console.timeEnd('animation_time');
      //     // Бросаем событие окончания отрисовки линии.
      //     line.events.fire('animation_finished_event');
      //   }
      // }

      function loop(index, previousTime) {
        if (index < coords.length) {

          let waitTime = 0
          if (index !== 0) { waitTime = getTimestamp(coords[index]) - getTimestamp(coords[index-1]) }
          console.log('---log--- waitTime = ', waitTime)
          let currentTime = Date.now()
          if (index === 0 || (currentTime - previousTime) >= waitTime) {
            console.log('---log--- set coords['+index+'] = ', coords[index])
            line.geometry.set(index, coords[index]);
            index++;
            previousTime = currentTime;
          }

          requestAnimationFrame(function() {
            loop(index, previousTime || 0)
          });

        } else {

          console.timeEnd('animation_time');
          // Бросаем событие окончания отрисовки линии.
          line.events.fire('animation_finished_event');

        }
      }

      console.time('animation_time')
      loop(index);
    },
    // Убрать отрисованную линию.
    reset: function() {
      console.log('---log--- reset()')
      this.geometry.setCoordinates([]);
    },
    // Запустить полный цикл анимации.
    animate: function() {
      console.log('---log--- animate()')
      this.reset();
      this._start();
      let deferred = vow.defer();
      this.events.once('animation_finished_event', function() {
        deferred.resolve();
      });
      return deferred.promise();
    }

  });

  // Функция генерации частых координат по заданной линии.
  // function generateSmoothCoords(coords, minDistance) {
  //   let smoothCoords = [];
  //   smoothCoords.push(coords[0]);
  //   for (let i = 1; i < coords.length; i++) {
  //     let difference = [coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]];
  //     let maxAmount = Math.max(Math.abs(difference[0] / minDistance), Math.abs(difference[1] / minDistance));
  //     let minDifference = [difference[0] / maxAmount, difference[1] / maxAmount];
  //     let lastCoord = coords[i - 1];
  //     while (maxAmount > 1) {
  //       lastCoord = [lastCoord[0] + minDifference[0], lastCoord[1] + minDifference[1]];
  //       smoothCoords.push(lastCoord);
  //       maxAmount--;
  //     }
  //     smoothCoords.push(coords[i])
  //   }
  //   return smoothCoords;
  // }

  // Функция нахождения расстояния между двумя точками на плоскости.
  // function getDistance(point1, point2) {
  //   const d = Math.sqrt( Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2) );
  //   console.log('---log--- distance = ', d)
  //   return d
  // }

  function getTimestamp(point) { return Date.parse(point[2]) }

  provide(AnimatedLine);
});
