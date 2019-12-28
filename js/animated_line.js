"use strict";

ymaps.modules.define('AnimatedLine', [
  'util.defineClass',
  'Polyline',
  'vow'
], function(provide, defineClass, Polyline, vow) {

  function AnimatedLine(gpsDataSet, properties, options) {
    console.log('---log---  AnimatedLine() ')
    AnimatedLine.superclass.constructor.call(this, gpsDataSet, properties, options);

    const startTime = Date.parse(gpsDataSet[0][2])
    console.log('---log--- startTime = ', startTime)
    const finishTime = Date.parse(gpsDataSet[gpsDataSet.length-1][2])
    console.log('---log--- finishTime = ', finishTime)
    this._animationTime =  finishTime - startTime;
    console.log('---log--- this._animationTime = ', this._animationTime)

    this._gpsDataSet = gpsDataSet
  }

  defineClass(AnimatedLine, Polyline, {
    // Анимировать линию.
    _start: function() {
      console.log('---log--- _start()')
      let index = 0;
      const coords = this._gpsDataSet;
      let line = this;

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

  function getTimestamp(point) { return Date.parse(point[2]) }

  provide(AnimatedLine);
});
