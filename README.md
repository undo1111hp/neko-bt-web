# Express Practice App (Nekopara UX)

Ung dung thuc hanh Routing, Cookie, Session, dang nhap co ban va kiem soat truy cap.
Frontend da duoc nang cap theo chu de Anime Nekopara.

## 1. Cai dat

```bash
npm install
```

Tao file .env tu .env.example:

```env
PORT=3000
SESSION_SECRET=replace-with-strong-secret
SESSION_COOKIE_MAX_AGE_MS=1800000
THEME_COOKIE_MAX_AGE_MS=604800000
```

## 2. Chay app

```bash
npm run dev
```

Hoac:

```bash
npm start
```

## 3. Frontend pages

- GET /
  - Trang chu hien thi theo cookie theme light/dark
  - Hien trang thai login hien tai
  - Hien toast UX khi doi theme hoac co trang thai tu redirect
- GET /login
  - Form login username/password
  - Hien thong bao loi dang nhap than thien hon
- GET /profile
  - Trang ca nhan co username, loginTime, profileViewCount
  - Moi lan F5 tang profileViewCount trong cung session
- GET /logout
  - Dang xuat va quay ve /login
- GET /set-theme/:theme
  - Chuyen theme light/dark va luu cookie

Theme label tren giao dien:
- light = Vanilla Day
- dark = Midnight Cat

## 4. Tai khoan test

- alice / alice123
- bob / bob123
- demo / demo123

## 5. API compatibility

Cac route van ho tro JSON cho test API (client gui Accept: application/json hoac Content-Type: application/json):

- GET /
- GET /login
- POST /login
- GET /profile
- GET /logout
- GET /set-theme/:theme

## 6. UX enhancements

- Toast thong bao trang thai (login, logout, doi theme, auth required)
- Chuyen theme muot hon bang client-side transition (khong reload trang)
- Trang 404 va 500 than thien cho browser
- API client van nhan JSON error/status nhu cu
- Them khu vuc mascot trong giao dien (assets mau tai public/assets/characters)

Su dung PNG mascot (khuyen nghi):
- Dat file choco vao: public/assets/characters/choco-mascot.png
- Dat file vanilla vao: public/assets/characters/vanilla-mascot.png
- Neu PNG chua co, giao dien tu fallback ve SVG mau de tranh vo layout

## 7. Test frontend nhanh

1. Mo http://localhost:3000
2. Bam Vanilla Day hoac Midnight Cat de doi theme
3. Vao Login va dang nhap bang tai khoan demo
4. Vao Profile va refresh nhieu lan de thay counter tang
5. Bam Logout, sau do thu truy cap /profile de kiem tra bi redirect ve /login
6. Thu mo duong dan sai, vi du /abcxyz, de thay trang 404 than thien

## 8. Test tu dong (Playwright)

Chay bo test UX + API compatibility:

```bash
npm test
```

Mo Playwright UI mode:

```bash
npm run test:ui
```

Noi dung da duoc cover boi test:
- Home page render theme Nekopara + mascot block
- Theme switch mượt (client-side) va toast
- Login -> profile -> counter tang -> logout
- Browser 404 page
- API mode: /profile unauth = 401 JSON
- API mode: /set-theme/invalid = 400 JSON
