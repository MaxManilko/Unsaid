# Практична робота №9: SEO-оптимізація сайту Unsaid

## 1. Визначення цільової аудиторії

Сайт Unsaid орієнтований на молодь 16-30 років, активних користувачів соціальних мереж, студентів, креативну аудиторію та людей, які цікавляться емоційними історіями, анонімним самовираженням і сучасними онлайн-спільнотами. Основна географія для старту: Україна, Європа та англомовні користувачі, які шукають простір для anonymous messages, unsent letters і relationship notes.

Основні потреби аудиторії:

- анонімно поділитися повідомленням, яке не було надіслане;
- прочитати схожі історії та відчути емоційну підтримку;
- зберегти приватність без прямого контакту з адресатом;
- знайти простий, естетичний і безпечний архів емоційних нотаток.

## 2. Аналіз конкурентів

| Конкурент | Ніша | SEO-стратегія | Популярні напрями ключових слів |
| --- | --- | --- | --- |
| theunsentproject.com | архів невідправлених повідомлень | сильний бренд, пошук за іменами, емоційні запити | unsent messages, the unsent project, messages to ex |
| postsecret.com | анонімні секрети | регулярний контент, впізнаваний формат, емоційні історії | anonymous secrets, post secret, share a secret |
| letterstocrushes.com | листи про стосунки | user-generated content, романтичні long-tail запити | letters to crushes, love letters, anonymous crush letters |
| futureme.org | листи в майбутнє | чітка функція, високий намір користувача | write a letter to future self, future letter, send future email |

Висновок: для Unsaid варто просувати сторінки навколо тем "anonymous messages", "unsent letters", "submit anonymous message", "emotional archive" і long-tail запитів про стосунки, невисловлені почуття та анонімні нотатки.

## 3. Семантичне ядро

### Anonymous messages

- anonymous messages
- anonymous message archive
- read anonymous messages
- submit anonymous message
- anonymous emotional notes

### Unsent letters

- unsent letters
- unsent message archive
- letters never sent
- write what stayed unsaid
- messages never sent

### Relationship notes

- relationship notes
- messages to someone you miss
- anonymous love notes
- apology messages unsent
- emotional notes about relationships

### Emotional archive

- emotional archive
- public archive for private feelings
- anonymous writing community
- safe space for emotional writing
- private feelings archive

### Long-tail keywords for news/blog

- how to write an anonymous message safely
- why people write unsent letters
- how anonymous message archives help people feel seen
- best practices for sharing emotional writing online
- how moderation protects anonymous communities

## 4. Вибір ключових слів для сторінок

| Сторінка | Основні ключові слова | Призначення |
| --- | --- | --- |
| `index.html` | anonymous messages, unsent letters, emotional archive | головна сторінка та архів повідомлень |
| `submit.html` | submit anonymous message, write unsent letter | сторінка додавання повідомлення |
| `about.html` | anonymous message archive, private feelings archive | пояснення ідеї проєкту |
| `news.html` | anonymous archive updates, unsent letter updates | новини, блог і long-tail SEO |
| `contacts.html` | contact anonymous archive, archive support | звернення до команди |
| `terms.html` | anonymous message rules, moderation, privacy | правила, безпека та приватність |
| `archives.html` | Unsaid archive redirect, anonymous message archive | службова сторінка перенаправлення |

## 5. Мета-теги

Для кожної HTML-сторінки додано унікальний `title` до 60 символів і `meta description` до 160 символів. Ключові слова також природно використані в основних заголовках `h1` та частині `h2`, щоб пошукові системи краще розуміли тематику сторінок.

## 6. Robots.txt та Sitemap.xml

Створено файл `robots.txt` у корені сайту:

```txt
User-agent: *
Disallow: /admin/
Disallow: /login/
Allow: /

Sitemap: https://html-starter-delta-kohl.vercel.app/sitemap.xml
```

Створено файл `sitemap.xml` з основними сторінками сайту:

- `https://html-starter-delta-kohl.vercel.app/`
- `https://html-starter-delta-kohl.vercel.app/submit.html`
- `https://html-starter-delta-kohl.vercel.app/about.html`
- `https://html-starter-delta-kohl.vercel.app/news.html`
- `https://html-starter-delta-kohl.vercel.app/contacts.html`
- `https://html-starter-delta-kohl.vercel.app/terms.html`
- `https://html-starter-delta-kohl.vercel.app/archives.html`

Для всіх сторінок вказано `lastmod` = `2026-05-14`, `changefreq` і `priority`.

## 7. План первинної SEO-кампанії

1. Додати сайт `https://html-starter-delta-kohl.vercel.app/` у Google Search Console.
2. Підтвердити право власності через HTML-файл, DNS-запис або інший доступний метод.
3. Надіслати `sitemap.xml` у Google Search Console.
4. Перевірити, чи доступні сторінки `/robots.txt` і `/sitemap.xml`.
5. Підключити Google Analytics для відстеження трафіку, джерел переходів і поведінки користувачів.
6. Моніторити індексацію, кліки, покази, CTR і пошукові запити.
7. Регулярно оновлювати `news.html` матеріалами під long-tail keywords.
8. Аналізувати популярні повідомлення й розширювати семантичне ядро відповідно до поведінки користувачів.

## 8. Очікуваний результат

Після виконання SEO-налаштувань сайт матиме базову технічну підготовку до індексації, релевантні мета-теги, зрозумілу структуру сторінок для пошукових систем і навчальний SEO-звіт, який покриває всі пункти практичної роботи №9.
