"use strict";

const DEBUG = true
if (DEBUG !== true) { console.log = ()=>{} }

// 1. load json data; resolve(data)
// 2. (data) -> filter the data; resolve(filtered_data)
// 3. (filtered_data) -> init map

$.getJSON("gps_kropotkino.json")
  .then( (dataSet) => {
    console.log('---log--- data = ', dataSet);
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

    function getDistance(point1, point2) {
      return Math.sqrt( Math.pow((point2[0] - point1[0]), 2) + Math.pow((point2[1] - point1[1]), 2) );
    }

    const filteredDataSet = filterDataSet(dataSet, 0.000003)
    console.log('---log--- filteredDataSet.length = ', filteredDataSet.length)

    return filteredDataSet;
  }).then( (filteredDataSet) => {
    console.log('---log--- filteredDataSet.length = ', filteredDataSet.length)
    ymaps.ready(['AnimatedLine']).then((ymaps) => {
      console.log('---log--- ymaps = ', ymaps);
      init_map(ymaps, filteredDataSet);
    })

  });

function init_map(ymaps, filteredDataSet) {
  console.log('---log--- init_map')
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

  animatedLine.animate()
}
