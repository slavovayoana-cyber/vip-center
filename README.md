# VIP CLEANING CENTER — уебсайт

Едностраничен сайт за автомивка VIP CLEANING CENTER, Стара Загора: **https://avtomivka.vip**
Чист HTML/CSS/JS без build стъпка: хоства се директно от GitHub Pages.

## Файлове

| Файл | Какво съдържа |
| --- | --- |
| `index.html` | Цялото съдържание: услуги, процес, ценоразпис (една програма), отзиви, въпроси, контакти |
| `styles.css` | Дизайн (цветовете са в `:root` най-отгоре) |
| `script.js` | Мобилно меню, анимации, карусел, „Отворено сега“, активна секция в менюто |
| `fonts/` | Шрифтовете Unbounded и Manrope (локално, без заявки към Google) |
| `images/` | Снимки от автомивката в WebP + JPEG, в няколко размера за бързо зареждане на телефон |
| `404.html` | Страница „Не е намерена“ в стила на сайта |
| `sitemap.xml` | За Google Search Console |

Lighthouse (телефон): 98 скорост · 100 достъпност · 100 добри практики · 100 SEO.

## Преглед локално

Отворете `index.html` в браузъра или пуснете:

```bash
python3 -m http.server 8000
```

и отидете на http://localhost:8000.

## Публикуване (GitHub Pages)

Settings → Pages → Build and deployment → Source: **Deploy from a branch**,
Branch: **main**, папка **/ (root)** → Save.
Сайтът е на `https://avtomivka.vip` (`https://slavovayoana-cyber.github.io/vip-center/` пренасочва натам).
Всеки push в `main` обновява сайта автоматично.

## Собствен домейн: avtomivka.vip (Namecheap)

1. **Namecheap** → Domain List → `avtomivka.vip` → Manage:
   - Nameservers: **Namecheap BasicDNS**.
   - Advanced DNS → Host Records: изтрийте паркинг записите (`URL Redirect` за `@` и
     `CNAME` `www` → `parkingpage.namecheap.com`) и добавете:

   | Type | Host | Value | TTL |
   | --- | --- | --- | --- |
   | A Record | `@` | `185.199.108.153` | Automatic |
   | A Record | `@` | `185.199.109.153` | Automatic |
   | A Record | `@` | `185.199.110.153` | Automatic |
   | A Record | `@` | `185.199.111.153` | Automatic |
   | CNAME Record | `www` | `slavovayoana-cyber.github.io.` | Automatic |

   TXT записът `v=spf1 include:spf.efwd.registrar-servers.com ~all` е за пренасочване на
   имейли от Namecheap и може да остане.
2. **GitHub** → това хранилище → Settings → Pages → Custom domain: `avtomivka.vip` → Save.
   GitHub добавя файл `CNAME` в `main`.
3. Щом DNS проверката мине, отметнете **Enforce HTTPS** (сертификатът идва автоматично,
   обикновено до час).
4. **Пазене на домейна (препоръчително):** профилът в GitHub → Settings → Pages →
   Add a domain → `avtomivka.vip` → добавете показания TXT запис в Namecheap
   (Host: `_github-pages-challenge-slavovayoana-cyber`) → Verify.
5. Адресите в кода (`canonical`, `og:url`, `og:image`, JSON-LD, `sitemap.xml`, `robots.txt`)
   са `https://avtomivka.vip/`. `404.html` работи и на двата адреса.
6. **След това:** сложете `avtomivka.vip` в Google Business профила и във Facebook страницата,
   и добавете сайта в Google Search Console с `https://avtomivka.vip/sitemap.xml`.

## SEO: за „автомивка Стара Загора“

В сайта: заглавие и описание с „Автомивка Стара Загора“, H1 с ключовата фраза, JSON-LD
`AutoWash` (адрес, координати 42.4205, 25.6325 — паркинг на хотел „Железник“, работно време,
цени, Facebook, старото име CLEANSING VIP CENTER като `alternateName`), FAQ данни,
`sitemap.xml`, `robots.txt`, Lighthouse SEO 100.

Извън сайта (това решава класирането в Google Maps и „местните“ резултати):
1. **Google Search Console** → Add property → Domain `avtomivka.vip` → TXT запис в Namecheap
   (Advanced DNS, Host `@`) → Verify → Sitemaps: `https://avtomivka.vip/sitemap.xml` →
   URL Inspection → `https://avtomivka.vip/` → Request indexing.
2. **Google Business профил** (business.google.com): Уебсайт `https://avtomivka.vip`,
   основна категория „Автомивка“, точен пин, работно време (събота до 16:00), снимки,
   отговори на отзивите. Името трябва да съвпада с табелата.
3. Същото име, адрес и телефон навсякъде (сайт, Google, Facebook, каталози).
4. Нови отзиви в Google: молба към доволни клиенти (линк „Напишете отзив“ от профила).

## Какво още трябва от клиента

- [x] Снимки „преди / след“ от работата на Мария са в `images/results/` (секция „Преди / След“).
- [x] Снимките в „Защо нас“, „Преди / След“ и `og.jpg` (за споделяне) са от автомивката.
      Снимката в началото (`hero-*`) е безплатна от Pexels
      ([кола](https://www.pexels.com/photo/cars-lights-car-vehicle-1729993/)), по избор на клиента.
- [x] Телефонът остава. Прането на салон е без цена („по запитване“). Плащане само в брой.
      Не се записват часове: клиентите идват директно в работно време.
- [x] Работно време: пон–пет 08:30–17:30, събота 09:00–16:00, неделя почивен ден.
- [ ] Потвърждение на рейтинга в Google (4.5 ★ / 64 отзива).
- [x] Ванът е на цената на джипа (28 €).
- [ ] Цени: сега 25 € (лек автомобил) / 28 € (джип или ван). Клиентът каза, че по-късно може да станат 28 / 33 €
      (както е на табелото). Сменят се в ценоразписа, във „Въпроси“, в „Защо нас“ и в JSON-LD в `index.html`.
- [ ] Домейн `avtomivka.vip`: DNS в Namecheap и Custom domain в GitHub (стъпките по-горе).
