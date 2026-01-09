# Yönetim Paneli Arayüzü

Bu klasör, `KullaniciYS` ASP.NET Web API projesi için hazırlanan Google tarzı yönetim paneli arayüzünü içerir. Uygulama Vite + React kullanılarak geliştirilmiştir ve backend `http://localhost:5000/api` adresi üzerinden tüketilir.

## Başlangıç

```powershell
cd frontend
npm install
npm run dev
```

Geliştirme sunucusu varsayılan olarak `http://localhost:5173` adresinde çalışır.

## Özellikler

- Token tabanlı oturum yönetimi (localStorage)
- Yönetim paneli metrikleri ve son kullanıcı listesi
- Kullanıcı CRUD işlemleri, aktif/pasif durumu ve rol atamaları
- Rol CRUD akışları ve kullanıcı sayısı görüntüleme
- Kayıt ve giriş formları, durum ve hata yönetimi
- Google materyalinden esinlenen responsive tasarım

## Yapı

- `src/services`: Axios tabanlı API istemcileri (auth, kullanıcı, rol, dashboard)
- `src/pages`: Sayfalar (Dashboard, Login, Register, Users, UserForm, Roles, RoleForm)
- `src/components`: Ortak bileşenler (Navbar)
- `src/index.css`: Tema, layout ve bileşen stilleri

Backend projesiyle birlikte çalıştırıldığında tüm endpoint'lerle hizalı, uçtan uca yönetim paneli deneyimi sunar.
