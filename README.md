# yandex-map
Animate line on yandex map

--- Задача основная:
Выбрать любую карту (гугл, яндекс, не важно).
Карту переключить в режим спутника.
Поверх карты нужно нарисовать анимацию движения условного трактора по
полю.

Входной датасет:
GPS-данные. 7 столбцов:
Широта градусы, широта минуты, N;
Долгота градусы, долгота минуты, E;
Дата_время

Есть периоды, когда трактор стоит, есть периоды, когда едет. Но в целом он
двигается по типичной траектории.
Необходимо плавно анимировать движение по этим точкам, так, будто мы в
реалтайме смотрим как едет трактор.

--- Дополнительная задача:
Если будешь укладываться по времени - покажи какие-нибудь рандомные маркеры
на отображаемой траектории. Эти маркеры - события (нарушения/отклонения)
совершенные вдоль траектории следования трактора.
Код присылай в удобном тебе виде. Гитхаб/лаб, архив) Главное, чтобы мы могли
его запустить и посмотреть.
