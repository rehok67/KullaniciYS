# Kullanıcı Yönetim Sistemi - Full Stack Projesi

# Video Linki (Hocam mikrofon bozuk olduğu icin sesi kisik cikmis):
https://drive.google.com/file/d/1FCxxWfUmi7Hh2UZ58_YcETTwm3cp_3s4/view?usp=sharing



ASP.NET Web API (.NET Framework 4.7.2) backend ve React (Vite) frontend ile geliştirilmiş full-stack kullanıcı ve görev yönetim sistemi.

## 🎯 Proje Özeti

Bu proje, kullanıcı ve rol yönetimi, görev atama ve dashboard görüntüleme özelliklerine sahip modern bir web uygulamasıdır. Backend ASP.NET Web API ile geliştirilmiş RESTful API, frontend ise React ile geliştirilmiş responsive bir SPA (Single Page Application) yapısındadır.

## 🚀 Teknolojiler

### Backend
- ASP.NET Web API (.NET Framework 4.7.2)
- Entity Framework 6.4.4
- SQL Server / LocalDB
- LINQ to Entities
- SHA256 Password Hashing

### Frontend
- React 19.1.1
- Vite 7.1.7
- React Router DOM 7.9.5
- Axios 1.13.1
- Modern CSS (Flexbox, Grid)
- Google Material Design inspired UI

## ✨ Özellikler

### Backend Özellikleri
- ✅ RESTful API mimarisi
- ✅ Entity Framework Code-First yaklaşımı
- ✅ CORS desteği
- ✅ Kullanıcı kimlik doğrulama ve yetkilendirme
- ✅ Rol tabanlı erişim kontrolü (Admin, Manager, User)
- ✅ Kullanıcı CRUD işlemleri
- ✅ Rol CRUD işlemleri
- ✅ Görev yönetimi ve atama sistemi
- ✅ Dashboard istatistikleri
- ✅ Seed data ile otomatik veri yükleme

### Frontend Özellikleri
- ✅ Token tabanlı authentication (localStorage)
- ✅ Responsive ve modern tasarım
- ✅ Role-based route protection (PrivateRoute)
- ✅ Dashboard ile özet bilgiler ve metriks
- ✅ Kullanıcı yönetimi (listeleme, ekleme, düzenleme, silme, aktif/pasif yapma)
- ✅ Rol yönetimi (listeleme, ekleme, düzenleme, silme)
- ✅ Görev yönetimi (Admin/Manager için görev oluşturma, kullanıcılara atama)
- ✅ Kullanıcılar için görev takibi ve tamamlama
- ✅ Form validasyonları ve hata yönetimi
- ✅ Real-time kullanıcı bilgisi güncelleme
- ✅ Dinamik navbar ve yetki bazlı menü gösterimi

## 📋 Gereksinimler

## 📋 Gereksinimler

### Backend
- Visual Studio 2017 veya daha yenisi
- .NET Framework 4.7.2
- SQL Server (LocalDB, Express veya Full version)
- IIS veya IIS Express

### Frontend
- Node.js 16.x veya üzeri
- npm veya yarn
- Modern web tarayıcı (Chrome, Firefox, Edge, Safari)

## 🛠️ Kurulum

### Backend Kurulumu

#### 1. Projeyi Açın

1. `KullaniciYS.sln` dosyasını Visual Studio ile açın
2. Solution Explorer'da projeye sağ tıklayın
3. "Restore NuGet Packages" seçeneğini seçin (otomatik yapılmazsa)

### 2. Database Bağlantısını Ayarlayın

`Web.config` dosyasını açın ve `connectionStrings` bölümünü düzenleyin:

**Windows Authentication için (Önerilen):**
```xml
<add name="DefaultConnection"
     connectionString="Data Source=localhost;Initial Catalog=KullaniciYS;Integrated Security=True;MultipleActiveResultSets=True"
     providerName="System.Data.SqlClient" />
```

**SQL Server Authentication için:**
```xml
<add name="DefaultConnection"
     connectionString="Data Source=localhost;Initial Catalog=KullaniciYS;User Id=sa;Password=YourPassword;MultipleActiveResultSets=True"
     providerName="System.Data.SqlClient" />
```

**LocalDB için:**
```xml
<add name="DefaultConnection"
     connectionString="Data Source=(LocalDB)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\KullaniciYS.mdf;Integrated Security=True"
     providerName="System.Data.SqlClient" />
```

### 3. Database Oluşturma

Projeyi ilk çalıştırdığınızda Entity Framework otomatik olarak database'i oluşturacak ve aşağıdaki seed data'yı ekleyecek:

**Default Admin Kullanıcısı:**
- Kullanıcı Adı: `admin`
- Şifre: `admin123`
- Email: `admin@example.com`

**Default Roller:**
- Admin
- User
- Manager

### 4. Projeyi Çalıştırın

1. Visual Studio'da F5'e basın veya "IIS Express" butonuna tıklayın
2. Tarayıcınız otomatik açılacak
3. API endpoint'leri `http://localhost:5000/api/` adresinde çalışacak

### Frontend Kurulumu

#### 1. Bağımlılıkları Yükleyin

```bash
cd frontend
npm install
```

#### 2. Ortam Değişkenlerini Ayarlayın (Opsiyonel)

Frontend, varsayılan olarak `http://localhost:5000/api` adresindeki backend'e bağlanır. Farklı bir adres kullanmak isterseniz:

```bash
# frontend klasöründe .env dosyası oluşturun
VITE_API_BASE_URL=http://localhost:5000/api
```

#### 3. Development Server'ı Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

#### 4. Production Build

```bash
npm run build
npm run preview
```

## 🎮 Kullanım

### İlk Giriş

1. Backend'i Visual Studio'dan çalıştırın (`http://localhost:5000`)
2. Frontend'i çalıştırın (`http://localhost:5173`)
3. Tarayıcınızda `http://localhost:5173/login` adresine gidin
4. Varsayılan admin hesabıyla giriş yapın:
   - **Kullanıcı Adı:** `admin`
   - **Şifre:** `admin123`
3. Tarayıcınızda `http://localhost:5173/login` adresine gidin
4. Varsayılan admin hesabıyla giriş yapın:
   - **Kullanıcı Adı:** `admin`
   - **Şifre:** `admin123`

### Frontend Sayfaları

#### 🏠 Dashboard (`/dashboard`)
- Sistem geneli istatistikler (toplam kullanıcı, aktif kullanıcı, toplam rol sayısı)
- Son eklenen kullanıcılar listesi
- Kullanıcıya atanmış görevler ve tamamlama özelliği
- Admin ve Manager için tüm kullanıcı görevlerini görüntüleme

#### 👥 Kullanıcılar (`/users`)
- **Admin:** Tüm kullanıcıları görüntüleme, ekleme, düzenleme, silme
- **Manager:** Kendi atadığı kullanıcıları görüntüleme
- Kullanıcı arama ve filtreleme
- Kullanıcı durumunu aktif/pasif yapma
- Kullanıcı bilgileri: Ad, email, telefon, departman, roller

#### 📝 Kullanıcı Ekleme/Düzenleme (`/users/new`, `/users/edit/:id`)
- **Sadece Admin yetkisi**
- Kullanıcı bilgileri formu
- Rol ataması
- Form validasyonu

#### 🎭 Roller (`/roles`)
- **Admin ve Manager yetkisi**
- Tüm rolleri listeleme
- Yeni rol ekleme
- Rol düzenleme ve silme
- Her rolde kaç kullanıcı olduğunu görme

#### ✅ Görev Yönetimi (`/tasks`)
- **Admin ve Manager yetkisi**
- Yeni görev oluşturma
- Görevleri kullanıcılara atama (çoklu atama destekli)
- Görev önceliği belirleme (Düşük, Orta, Yüksek)
- Bitiş tarihi belirleme
- Oluşturulan görevleri listeleme ve izleme

#### 🔐 Login/Register (`/login`, `/register`)
- Kullanıcı girişi
- Yeni kullanıcı kaydı
- Token yönetimi ve localStorage kaydı

### Rol Bazlı Yetkilendirme

| Özellik | Admin | Manager | User |
|---------|-------|---------|------|
| Dashboard görüntüleme | ✅ | ✅ | ✅ |
| Tüm kullanıcıları görme | ✅ | ❌ | ❌ |
| Yönetilen kullanıcıları görme | ✅ | ✅ | ❌ |
| Kullanıcı ekleme/düzenleme | ✅ | ❌ | ❌ |
| Kullanıcı silme | ✅ | ❌ | ❌ |
| Rol yönetimi | ✅ | ✅ | ❌ |
| Görev oluşturma | ✅ | ✅ | ❌ |
| Görev tamamlama | ✅ | ✅ | ✅ |

## 🔌 API Endpoint'leri

### Authentication

- **POST** `/api/auth/login` - Kullanıcı girişi
  ```json
  {
    "userName": "admin",
    "password": "admin123"
  }
  ```

- **POST** `/api/auth/register` - Yeni kullanıcı kaydı
  ```json
  {
    "userName": "yenikullanici",
    "email": "user@example.com",
    "password": "123456",
    "fullName": "Ad Soyad",
    "phone": "555-1234",
    "department": "IT"
  }
  ```

### Users

- **GET** `/api/users` - Tüm kullanıcıları listele
  - Query params: `search`, `role`, `isActive`
- **GET** `/api/users/{id}` - Kullanıcı detayı
- **POST** `/api/users` - Yeni kullanıcı ekle
- **PUT** `/api/users/{id}` - Kullanıcı güncelle
- **DELETE** `/api/users/{id}` - Kullanıcı sil
- **POST** `/api/users/{id}/toggle-status` - Kullanıcı durumunu değiştir

### Roles

- **GET** `/api/roles` - Tüm rolleri listele
- **GET** `/api/roles/{id}` - Rol detayı
- **POST** `/api/roles` - Yeni rol ekle
- **PUT** `/api/roles/{id}` - Rol güncelle
- **DELETE** `/api/roles/{id}` - Rol sil

### Dashboard

- **GET** `/api/dashboard/stats` - Dashboard istatistikleri
- **GET** `/api/dashboard/recent-users` - Son eklenen kullanıcılar

### Tasks (Görevler)

- **GET** `/api/tasks/my-tasks` - Kullanıcının görevleri
- **GET** `/api/tasks/manager-tasks` - Manager'ın oluşturduğu görevler
- **POST** `/api/tasks` - Yeni görev oluşturma
  ```json
  {
    "title": "Görev Başlığı",
    "description": "Görev açıklaması",
    "priority": "Medium",
    "dueDate": "2026-01-15T00:00:00",
    "assignedToUserIds": [1, 2, 3]
  }
  ```
- **PUT** `/api/tasks/{id}/complete` - Görevi tamamla
- **DELETE** `/api/tasks/{id}` - Görev silme

## 🧪 Test Etme

### Frontend Test

1. Backend'in çalıştığından emin olun (`http://localhost:5000`)
2. Frontend'i çalıştırın: `cd frontend && npm run dev`
3. Tarayıcıda `http://localhost:5173/login` adresine gidin
4. Admin hesabıyla giriş yapın (`admin` / `admin123`)
5. Dashboard, kullanıcılar, roller ve görevler sayfalarını test edin

### Backend Test - Postman veya Browser ile

1. Login endpoint'ini test edin:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "userName": "admin",
  "password": "admin123"
}
```

2. Kullanıcı listesini görüntüleyin:
```
GET http://localhost:5000/api/users
```

3. Dashboard istatistiklerini görün:
```
GET http://localhost:5000/api/dashboard/stats
```

4. Görev oluşturun:
```
POST http://localhost:5000/api/tasks
Content-Type: application/json

{
  "title": "Test Görevi",
  "description": "Test açıklaması",
  "priority": "High",
  "dueDate": "2026-01-20T00:00:00",
  "assignedToUserIds": [1]
}
```

## 📁 Proje Yapısı

```
KullaniciYS/
├── frontend/                      # React Frontend
│   ├── public/                    # Statik dosyalar
│   │   └── vite.svg
│   ├── src/
│   │   ├── assets/                # Resimler, ikonlar
│   │   │   └── react.svg
│   │   ├── components/            # Paylaşılan bileşenler
│   │   │   └── Navbar.jsx         # Üst menü, kullanıcı bilgisi, logout
│   │   ├── pages/                 # Sayfa bileşenleri
│   │   │   ├── Dashboard.jsx      # Ana sayfa, istatistikler, görev listesi
│   │   │   ├── Login.jsx          # Giriş sayfası
│   │   │   ├── Register.jsx       # Kayıt sayfası
│   │   │   ├── Users.jsx          # Kullanıcı listesi
│   │   │   ├── UserForm.jsx       # Kullanıcı ekleme/düzenleme formu
│   │   │   ├── Roles.jsx          # Rol listesi
│   │   │   ├── RoleForm.jsx       # Rol ekleme/düzenleme formu
│   │   │   └── TaskManagement.jsx # Görev yönetimi sayfası
│   │   ├── services/              # API servis katmanı
│   │   │   ├── api.js             # Axios instance, interceptors
│   │   │   ├── authService.js     # Login, register, logout
│   │   │   ├── userService.js     # Kullanıcı CRUD işlemleri
│   │   │   ├── roleService.js     # Rol CRUD işlemleri
│   │   │   ├── taskService.js     # Görev işlemleri
│   │   │   └── dashboardService.js # Dashboard verileri
│   │   ├── App.jsx                # Ana bileşen, routing, PrivateRoute
│   │   ├── App.css                # App stilleri
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global stiller, tema
│   ├── eslint.config.js           # ESLint yapılandırması
│   ├── vite.config.js             # Vite yapılandırması
│   ├── index.html                 # HTML entry point
│   ├── package.json               # Frontend bağımlılıkları
│   └── README.md                  # Frontend dokümantasyonu
│
├── App_Start/                     # ASP.NET yapılandırma
│   └── WebApiConfig.cs            # Web API, CORS yapılandırması
├── Controllers/                   # API Controllers
│   ├── AuthController.cs          # Authentication endpoint'leri
│   ├── UsersController.cs         # Kullanıcı CRUD endpoint'leri
│   ├── RolesController.cs         # Rol CRUD endpoint'leri
│   ├── TasksController.cs         # Görev yönetimi endpoint'leri
│   └── DashboardController.cs     # Dashboard endpoint'leri
├── Data/
│   └── AppDbContext.cs            # Entity Framework DbContext
├── Models/                        # Entity modelleri
│   ├── User.cs                    # Kullanıcı entity
│   ├── Role.cs                    # Rol entity
│   ├── UserTask.cs                # Görev entity
│   └── DTOs/                      # Data Transfer Objects
│       ├── LoginDto.cs
│       ├── RegisterDto.cs
│       ├── UserDto.cs
│       ├── UserTaskDto.cs
│       └── DashboardStatsDto.cs
├── Services/                      # İş mantığı servisleri
│   └── AuthService.cs             # Authentication servisi
├── Properties/
│   └── AssemblyInfo.cs            # Assembly metadata
├── Global.asax                    # Application başlangıç
├── Web.config                     # Ana yapılandırma, connection string
├── packages.config                # NuGet paketleri
└── README.md                      # Bu dosya
```

## 🎨 Frontend Teknoloji Detayları

### State Management
- **useState** - Komponent seviyesi state yönetimi
- **useEffect** - Lifecycle ve side effects
- **useMemo** - Performance optimizasyonu
- **useCallback** - Function memoization
- **localStorage** - Token ve kullanıcı bilgisi saklama

### Routing Yapısı
```javascript
/                        → Dashboard'a yönlendir
/login                   → Login sayfası (public)
/register                → Register sayfası (public)
/dashboard              → Dashboard (authenticated)
/users                  → Kullanıcı listesi (Admin, Manager)
/users/new              → Yeni kullanıcı (Admin only)
/users/edit/:id         → Kullanıcı düzenle (Admin only)
/roles                  → Rol listesi (Admin, Manager)
/roles/new              → Yeni rol (Admin only)
/roles/edit/:id         → Rol düzenle (Admin only)
/tasks                  → Görev yönetimi (Admin, Manager)
```

### API Integration
- **Axios** HTTP client
- **Interceptors** - Otomatik token ekleme
- **Error Handling** - Merkezi hata yönetimi
- **Base URL Configuration** - Environment-based API URL

### UI/UX Özellikleri
- **Responsive Design** - Mobil uyumlu
- **Loading States** - Kullanıcı geri bildirimi
- **Error Messages** - Anlaşılır hata mesajları
- **Form Validation** - Client-side validasyon
- **Conditional Rendering** - Role-based UI
- **Google Material Inspired** - Modern ve temiz tasarım

## ⚠️ Sık Karşılaşılan Sorunlar

### Database Bağlantı Hatası

**Sorun:** "A network-related or instance-specific error occurred"

**Çözüm:**
1. SQL Server servisinin çalıştığından emin olun
2. Connection string'deki server adını kontrol edin
3. SQL Server Configuration Manager'da TCP/IP'nin enabled olduğunu kontrol edin

### NuGet Package Hatası

**Sorun:** "Could not resolve this reference"

**Çözüm:**
1. Solution Explorer'da Solution'a sağ tıklayın
2. "Restore NuGet Packages" seçin
3. Projeyi rebuild edin

### Port Çakışması (Backend)

**Sorun:** Port 5000 kullanımda

**Çözüm:**
1. `KullaniciYS.csproj` dosyasını text editor ile açın
2. `<IISUrl>` satırındaki port numarasını değiştirin
3. Veya Project Properties > Web > Project Url'den portu değiştirin

### Port Çakışması (Frontend)

**Sorun:** Port 5173 kullanımda

**Çözüm:**
```bash
# vite.config.js dosyasında port değiştirin
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### CORS Hatası

**Sorun:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Çözüm:**
1. Backend'de CORS'un doğru yapılandırıldığından emin olun
2. `WebApiConfig.cs` dosyasında origin adresini kontrol edin
3. Frontend'in backend URL'ini doğru kullandığından emin olun

### API Bağlantı Hatası

**Sorun:** Frontend backend'e bağlanamıyor

**Çözüm:**
1. Backend'in çalıştığından emin olun (`http://localhost:5000`)
2. Browser Console'da network hatalarını kontrol edin
3. `frontend/src/services/api.js` dosyasında `baseURL`'i kontrol edin
4. `.env` dosyasında `VITE_API_BASE_URL` değişkenini kontrol edin

### Token Hatası

**Sorun:** "Token expired" veya "Unauthorized"

**Çözüm:**
1. Logout yapıp tekrar login olun
2. localStorage'ı temizleyin: `localStorage.clear()`
3. Tarayıcı cache'ini temizleyin

## 🔧 CORS Ayarları

API varsayılan olarak tüm origin'lere izin verir (`*`). Production'da bunu kısıtlamalısınız:

`App_Start/WebApiConfig.cs` dosyasında:
```csharp
var cors = new EnableCorsAttribute("http://localhost:5173", "*", "*");
// Veya production için
var cors = new EnableCorsAttribute("https://yourdomain.com", "*", "*");
```

## 🔒 Güvenlik Notları

## 🔒 Güvenlik Notları

**ÖNEMLI:** Bu proje eğitim amaçlıdır. Production ortamında:

### Backend Güvenlik
1. ✅ Şifre hash'leme için **BCrypt** veya **PBKDF2** kullanın (SHA256 yeterli değil)
2. ✅ **JWT Token** authentication ekleyin
3. ✅ HTTPS kullanın
4. ✅ SQL Injection'a karşı parameterized queries kullanın (EF zaten yapıyor)
5. ✅ Input validation ekleyin
6. ✅ Rate limiting ekleyin
7. ✅ Logging ekleyin (NLog, Serilog)
8. ✅ Exception handling middleware ekleyin

### Frontend Güvenlik
1. ✅ Token'ı güvenli şekilde saklayın (HttpOnly cookies tercih edilir)
2. ✅ XSS saldırılarına karşı input sanitization yapın
3. ✅ Hassas bilgileri localStorage'da tutmayın
4. ✅ HTTPS kullanın
5. ✅ Environment variables kullanarak API URL'lerini yönetin
6. ✅ CSRF token koruması ekleyin

## 🚀 Production Deployment

### Backend Deployment (IIS)
1. Visual Studio'da "Publish" seçeneğini kullanın
2. IIS'de application pool oluşturun
3. Web.config'de production connection string'i ayarlayın
4. HTTPS sertifikası yapılandırın

### Frontend Deployment
```bash
cd frontend
npm run build
# dist/ klasörü oluşacak, bunu static hosting servisine yükleyin
```

**Deployment Seçenekleri:**
- **Vercel** - Frontend için (ücretsiz)
- **Netlify** - Frontend için (ücretsiz)
- **Azure App Service** - Full-stack için
- **AWS Amplify** - Frontend için
- **IIS + Static Files** - Her ikisi için

## 📚 Kullanılan Teknolojiler ve Kütüphaneler

### Backend
- Entity Framework 6.4.4
- Microsoft.AspNet.WebApi 5.2.9
- Microsoft.AspNet.WebApi.Cors 5.2.9
- Newtonsoft.Json 13.0.1
- System.Security.Cryptography (SHA256)

### Frontend
- React 19.1.1
- React Router DOM 7.9.5
- Axios 1.13.1
- Vite 7.1.7
- ESLint 9.36.0

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

## 📝 Lisans

Bu proje eğitim amaçlıdır ve MIT Lisansı altında lisanslanmıştır.

---

**Not:** Bu proje, modern full-stack web development pratikleri için eğitim amaçlı hazırlanmıştır. Production kullanımı için yukarıda belirtilen güvenlik önlemlerini almayı unutmayın.
