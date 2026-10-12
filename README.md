# CLEANSING VIP CENTER — уебсайт

Едностраничен сайт за автомивка CLEANSING VIP CENTER, Стара Загора.
Чист HTML/CSS/JS без build стъпка: хоства се директно от GitHub Pages.

## Файлове

| Файл | Какво съдържа |
| --- | --- |
| `index.html` | Цялото съдържание: услуги, цени, отзиви, контакти |
| `styles.css` | Дизайн (цветовете са в `:root` най-отгоре) |
| `script.js` | Мобилно меню, анимации, карусел, „Отворено сега“ |
| `favicon.svg` | Иконка в таба на браузъра |

## Преглед локално

Отворете `index.html` в браузъра или пуснете:

```bash
python3 -m http.server 8000
```

и отидете на http://localhost:8000.

## Публикуване (GitHub Pages)

Settings → Pages → Build and deployment → Source: **Deploy from a branch**,
Branch: **main**, папка **/ (root)** → Save.
След около минута сайтът е на `https://slavovayoana-cyber.github.io/vip-center/`.
Всеки push в `main` обновява сайта автоматично.

## Какво още трябва от клиента

- [ ] Снимки за двете полета „СНИМКА“ (hero и „Защо нас“). Сложете ги в папка
      `images/` и заменете `<div class="photo-placeholder">…</div>` с
      `<img src="images/hero.jpg" alt="…">`.
- [ ] Линк към реалната Facebook страница (търсете `TODO` в `index.html`).
- [ ] Потвърждение на рейтинга в Google (4.5 ★ / 64 отзива) и на цените.
- [ ] Домейн (по желание), напр. `cleansing-vip.bg`: Settings → Pages → Custom domain.
