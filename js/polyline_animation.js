"use strict";

ymaps.ready(['AnimatedLine']).then(init);

function init(ymaps) {
  const DEBUG = true
  if (DEBUG !== true) { console.log = ()=>{} }

  console.log('---log---  init')

  const dataSet = [
    [45.345374032,40.138917891,"2019-11-02 06:44:08.199999"],
    [45.345373894,40.138917596,"2019-11-02 06:44:08.400000"],
    [45.345373764,40.138917889,"2019-11-02 06:44:08.600000"],
    [45.345374022,40.138917860,"2019-11-02 06:44:08.800000"],
    [45.345373433,40.138917791,"2019-11-02 06:44:09.000000"],
    [45.345373717,40.138918135,"2019-11-02 06:44:09.200000"],
    [45.345372592,40.138918415,"2019-11-02 06:44:09.400000"],
    [45.345372264,40.138918689,"2019-11-02 06:44:09.600000"],
    [45.345372361,40.138919232,"2019-11-02 06:44:09.800000"],
    [45.345372189,40.138920146,"2019-11-02 06:44:10.000000"]
  ]
  console.log('---log--- dataSet.length = ', dataSet.length)

  function filterDataSet(coords, minDistance) {
    let newCoords = [];
    newCoords.push(coords[0]);
    for (let i = 1; i < coords.length; i++) {
      let distance = getDistance(newCoords[newCoords.length-1], coords[i]);
      if ((distance >= minDistance) || (i === coords.length-1)) {
        newCoords.push(coords[i])
      }
    }
    return newCoords;
  }

  // Функция нахождения расстояния между двумя точками на плоскости.
  function getDistance(point1, point2) {
    const d = Math.sqrt( Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2) );
    // console.log('---log--- distance = ', d)
    return d
  }

  const filteredDataSet = filterDataSet(dataSet, 0.000003)
  console.log('---log--- filteredDataSet.length = ', filteredDataSet.length)

  // Создаем карту.
  const myMap = new ymaps.Map('map', {
    center: [45.345374032, 40.138917891],
    type: 'yandex#satellite',
    zoom: 19, //25,  // max=19
    controls: [] // карта без элементов управления
  }, {
    searchControlProvider: 'yandex#search'
  })

  // Создаем ломаные линии.
  const animatedLine = new ymaps.AnimatedLine(filteredDataSet, {}, {
    // Задаем цвет.
    strokeColor: '#ED4543',
    // Задаем ширину линии.
    strokeWidth: 4
  })

  // Добавляем линю на карту.
  myMap.geoObjects.add(animatedLine);

  // Функция анимации пути.
  function playAnimation() {
    animatedLine.animate()
      // После окончания анимации первой линии добавляем вторую метку на карту и анимируем вторую линию.
      // .then(function() {
      //     // myMap.geoObjects.add(secondPoint);
      //     return secondAnimatedLine.animate();
      // })
      // После окончания анимации второй линии добавляем третью метку на карту.
      .then(function() {
        // myMap.geoObjects.add(thirdPoint);
        // Добавляем паузу после анимации.
        return ymaps.vow.delay(null, 2000);
      })
      // После паузы перезапускаем анимацию.
      .then(function() {
        // Перезапускаем анимацию.
        // playAnimation();
      });
  }

  console.log('---log--- playAnimation()')
  // Запускаем анимацию пути.
  playAnimation();
}

// let str = 'string'
// const jsonStr = JSON.stringify(str)
// str = JSON.parse(jsonStr)
// console.log('---log--- str = ', str)

// jQuery.getJSON('data.json', function (json) {
//   console.log('---log--- json = ', json)
// });

