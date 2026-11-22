# Famous Jalyuzi: sayt + admin panel

Backend yo'q. Barcha ma'lumot bitta **`data.json`** faylida saqlanadi.

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `index.html`, `style.css`, `app.js` | Sayt |
| `data.json` | Pardalar, toifalar, Instagram videolar, sozlamalar |
| `images/` | Admin yuklagan rasmlar |
| `admin.html` | Admin panel |
| `start.bat` | Kompyuterda ishga tushirish |
| `eski/` | Eski dizayn (zaxira nusxa). Kerak bo'lmasa o'chirib tashlang |

## Ishga tushirish

`start.bat` ni ikki marta bosing. Brauzerda admin panel ochiladi:

- Sayt: http://localhost:8000
- Admin: http://localhost:8000/admin.html

(`index.html` ni to'g'ridan-to'g'ri ikki marta bosib ochsangiz, brauzer `data.json` ni o'qishga ruxsat bermaydi. Shuning uchun `start.bat` kerak. Hostingda bu muammo yo'q.)

## Admin panel

1. Chrome yoki Edge'da `admin.html` ni oching.
2. **📁 Papkani ulash** → sayt papkasini tanlang (bir marta).
3. **Pardalar** → «+ Yangi parda qo'shish»: nomi, toifa, narx (m²), tavsif, rasm.
4. **Toifalar** → yangi toifa; «Bosh sahifada» belgisi qo'yilganlar «Eng xaridorgir toifalar» blokida chiqadi.
5. **Ishlarimiz (rasmlar)** → o'rnatilgan ishlar rasmlari va izohi. Saytdagi «Bizning ishlar» galereyasida chiqadi (bosilsa kattalashadi).
6. **O'rnatish va hududlar** → o'rnatish qadamlari, o'lchash maslahatlari va xizmat hududlari (joy nomlari). Har qatorda bitta; qadam va maslahatlar `Sarlavha | matn` ko'rinishida.
7. **Instagram videolar** → Reels yoki post havolasini qo'ying (`https://www.instagram.com/reel/...`). Saytdagi «Video-gidlar» bo'limida chiqadi.
8. **Sozlamalar** → telefon, manzil, Telegram, Instagram, xarita, bosh sahifa rasmi.
9. **👁 Saytda ko'rish** → saqlamasdan oldin natijani ko'rish.
10. **💾 Saqlash** → `data.json` va rasmlar papkaga yoziladi.

Papka ulanmasa, **⬇ data.json** tugmasi faylni yuklab beradi: uni papkadagi `data.json` o'rniga qo'ying.

## Hostingga joylash

Yuklang: `index.html`, `style.css`, `app.js`, `data.json`, `images/`.
**`admin.html` ni yuklamang**: u faqat sizning kompyuteringizda ishlaydi. Har gal o'zgartirgandan keyin yangi `data.json` va `images/` ni hostingga qayta yuklang.

## Buyurtmalar (arizalar)

- Sozlamalarda *Ariza yuboriladigan manzil* (masalan Formspree) bo'lsa, ariza shu yerga yuboriladi.
- Bo'sh bo'lsa, mijozda sizning Telegram'ingiz tayyor xabar bilan ochiladi.
- Telegram ham bo'lmasa, telefon raqamingizga qo'ng'iroq ochiladi.
