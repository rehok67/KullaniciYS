# Kullanıcı Yönetim Sistemi API

ASP.NET Web API (.NET Framework 4.7.2) ile geliştirilmiş kullanıcı yönetim sistemi backend API'si.

## Gereksinimler

- Visual Studio 2017 veya daha yenisi
- .NET Framework 4.7.2
- SQL Server (LocalDB, Express veya Full version)
- IIS veya IIS Express

## Kurulum Adımları

### 1. Projeyi Açın

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

## API Endpoint'leri

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

## Test Etme

### Postman veya Browser ile Test

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

## Sık Karşılaşılan Sorunlar

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

### Port Çakışması

**Sorun:** Port 5000 kullanımda

**Çözüm:**
1. `KullaniciYS.csproj` dosyasını text editor ile açın
2. `<IISUrl>` satırındaki port numarasını değiştirin
3. Veya Project Properties > Web > Project Url'den portu değiştirin

## CORS Ayarları

API varsayılan olarak tüm origin'lere izin verir (`*`). Production'da bunu kısıtlamalısınız:

`App_Start/WebApiConfig.cs` dosyasında:
```csharp
var cors = new EnableCorsAttribute("http://localhost:3000", "*", "*");
```

## Güvenlik Notları

**ÖNEMLI:** Bu proje eğitim amaçlıdır. Production ortamında:

1. Şifre hash'leme için **BCrypt** veya **PBKDF2** kullanın (SHA256 yeterli değil)
2. **JWT Token** authentication ekleyin
3. HTTPS kullanın
4. SQL Injection'a karşı parameterized queries kullanın (EF zaten yapıyor)
5. Input validation ekleyin
6. Rate limiting ekleyin
7. Logging ekleyin

## Proje Yapısı

```
KullaniciYS/
├── App_Start/          # Yapılandırma dosyaları
├── Controllers/        # API Controller'ları
├── Data/              # DbContext ve Database yapılandırması
├── Models/            # Entity modelleri
│   └── DTOs/          # Data Transfer Objects
├── Properties/        # Assembly bilgileri
├── Services/          # İş mantığı servisleri
├── Global.asax        # Application başlangıç dosyası
└── Web.config         # Ana yapılandırma dosyası
```

## Destek

Sorun yaşarsanız:
1. Visual Studio Output penceresini kontrol edin
2. Event Viewer'da hata loglarına bakın
3. SQL Server Profiler ile database sorgularını inceleyin

## Lisans

Bu proje eğitim amaçlıdır.
