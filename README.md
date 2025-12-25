# 🌾 Ekim Karar Asistanı

Çiftçiler için hava durumuna göre ekim ve sulama karar önerisi veren web uygulaması.

## 📋 Proje Özeti

Bu proje, çiftçilere hava durumu verilerini analiz ederek ekim ve sulama için en uygun zamanı belirlemelerine yardımcı olan bir web uygulamasıdır. Uygulama, OpenWeatherMap API'sini kullanarak gerçek zamanlı hava durumu verilerini çeker ve basit kurallara dayalı karar önerileri sunar.

## 🚀 Özellikler

- **Tarla Yönetimi**: Tarlaları ekleme, düzenleme, silme ve listeleme (CRUD)
- **Akıllı Karar Sistemi**: Hava durumu verilerine göre otomatik ekim kararı önerileri
- **Karar Geçmişi**: Geçmiş kararları görüntüleme ve silme
- **Hava Durumu Analizi**: Sıcaklık, yağış, rüzgar gibi kritik parametreleri değerlendirme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu modern arayüz
- **Form Validasyonu**: Server-side ve client-side validasyon desteği

## 🛠️ Teknolojiler

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **View Engine**: EJS
- **Styling**: Bootstrap 5
- **Weather API**: OpenWeatherMap API

## 📁 Proje Yapısı

```
/project
  /src
    /config         # Database ve environment konfigürasyonları
    /models         # Database modelleri (Farm, Decision)
    /controllers    # Route controller'ları
    /routes         # Express route tanımlamaları
    /services       # Weather service ve decision engine
    /views          # EJS template dosyaları
      /layouts      # Layout ve partial dosyaları
      /farms        # Tarla sayfaları
      /decisions    # Karar sayfaları
    /public         # Static dosyalar (CSS, JS, images)
      /css
  server.js         # Ana uygulama dosyası
  package.json      # NPM bağımlılıkları
  .env.example      # Environment değişken örneği
  README.md         # Bu dosya
  database.sql      # Veritabanı kurulum scripti
```

## 🔧 Kurulum

### 1. Gereksinimler

- Node.js (v16.0.0 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- OpenWeatherMap API anahtarı ([https://openweathermap.org/api](https://openweathermap.org/api))

### 2. Projeyi Klonlayın veya İndirin

```bash
# Proje dizinine gidin
cd 16008124060
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
```

### 4. Veritabanını Kurun

PostgreSQL'de yeni bir veritabanı oluşturun:

```bash
# PostgreSQL'e bağlanın
psql -U postgres

# Veritabanını oluşturun
CREATE DATABASE ekim_karar_db;

# Veritabanından çıkın
\q
```

Veritabanı scriptini çalıştırın:

```bash
psql -U postgres -d ekim_karar_db -f database.sql
```

Veya `database.sql` dosyasındaki komutları PostgreSQL yönetim aracınızda çalıştırın.

### 5. Environment Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
PORT=3000
NODE_ENV=development

# Veritabanı bağlantısı için iki seçenek:
# 1. Connection String kullanımı:
# DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# 2. Ayrı değişkenler kullanımı (önerilen):
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=ekim_karar_db

WEATHER_API_KEY=your_openweather_api_key_here
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

### 6. Uygulamayı Çalıştırın

Development modu:
```bash
npm run dev
```

Production modu:
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 🌐 Render'da Deploy Etme

### 1. GitHub Repository Hazırlama

Projeyi bir GitHub repository'sine push edin.

### 2. Render'da Yeni Web Service Oluşturma

1. [Render](https://render.com) hesabınıza giriş yapın
2. "New +" → "Web Service" seçin
3. GitHub repository'nizi bağlayın
4. Ayarları yapılandırın:
   - **Name**: ekim-karar-asistani (veya istediğiniz isim)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free veya istediğiniz plan

### 3. Environment Variables Ayarlama

Render dashboard'unda "Environment" sekmesine gidin ve şu değişkenleri ekleyin:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=<PostgreSQL connection string>
WEATHER_API_KEY=<your_openweather_api_key>
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
```

### 4. PostgreSQL Database Oluşturma

1. Render'da "New +" → "PostgreSQL" seçin
2. Database'i oluşturun ve connection string'i kopyalayın
3. `DATABASE_URL` environment variable'ına ekleyin
4. Render PostgreSQL'in otomatik olarak sağladığı connection string'i kullanabilirsiniz veya kendi PostgreSQL veritabanınızı kullanabilirsiniz

### 5. Veritabanı Scriptini Çalıştırma

Render PostgreSQL kullanıyorsanız:

1. Render dashboard'undan PostgreSQL instance'ınızın detaylarına gidin
2. "Connect" butonuna tıklayın
3. "psql" komutunu kullanarak bağlanın veya dış bir PostgreSQL client kullanın
4. `database.sql` dosyasındaki komutları çalıştırın

Alternatif olarak, uygulama ilk başlatıldığında otomatik olarak tabloları oluşturmak için bir migration scripti ekleyebilirsiniz.

### 6. Deploy

Render otomatik olarak deploy edecektir. İlk deploy'dan sonra uygulamanız canlıda olacaktır.

## 📊 Veritabanı Şeması

### `farms` Tablosu

| Sütun        | Tip      | Açıklama                    |
|--------------|----------|-----------------------------|
| id           | SERIAL   | Primary Key                 |
| name         | VARCHAR  | Tarla adı                   |
| city         | VARCHAR  | Şehir                       |
| district     | VARCHAR  | İlçe                        |
| crop_type    | VARCHAR  | Ürün tipi (opsiyonel)       |
| area_decare  | DECIMAL  | Alan (dekar)                |
| created_at   | TIMESTAMP| Oluşturulma tarihi          |

### `planting_decisions` Tablosu

| Sütun              | Tip       | Açıklama                           |
|--------------------|-----------|------------------------------------|
| id                 | SERIAL    | Primary Key                        |
| farm_id            | INTEGER   | Foreign Key (farms.id)             |
| crop_type          | VARCHAR   | Ürün tipi                          |
| decision_status    | VARCHAR   | Karar durumu (UYGUN/UYGUN_DEGIL/UYARI) |
| reason             | TEXT      | Karar gerekçesi                    |
| weather_snapshot_json | JSONB | Hava durumu snapshot (opsiyonel)   |
| created_at         | TIMESTAMP | Oluşturulma tarihi                 |

## 🎯 API Endpoint'leri

### Farms

- `GET /farms` - Tarlaları listele
- `GET /farms/new` - Yeni tarla formu
- `POST /farms` - Yeni tarla oluştur
- `GET /farms/:id` - Tarla detayı
- `GET /farms/:id/edit` - Tarla düzenleme formu
- `POST /farms/:id` - Tarla güncelle
- `POST /farms/:id/delete` - Tarla sil

### Decisions

- `GET /decisions` - Karar geçmişi
- `GET /decisions/new` - Yeni karar formu
- `POST /decisions` - Yeni karar oluştur
- `GET /decisions/:id` - Karar detayı
- `POST /decisions/:id/delete` - Karar sil

## 🔍 Karar Algoritması

Uygulama, hava durumu verilerini analiz ederek şu kurallara göre karar üretir:

1. **Yağış Kontrolü**: Önümüzdeki 24-48 saat içinde yağış bekleniyorsa → "UYGUN DEĞİL"
2. **Sıcaklık Kontrolü**: 
   - 15-30°C arası → "UYGUN"
   - < 15°C → "UYARI" (düşük sıcaklık)
   - > 30°C → "UYARI" (yüksek sıcaklık)
3. **Rüzgar Kontrolü**: Rüzgar hızı > 12 m/s → "UYARI" (ilaçlama/sera işleri için dikkat)

## 🧪 Test

Uygulamayı test etmek için:

1. Birkaç tarla ekleyin
2. Ekim kararı alın
3. Karar geçmişini kontrol edin
4. Tarla bilgilerini düzenleyin

## 📝 Notlar

- OpenWeatherMap API anahtarı ücretsiz olarak alınabilir
- API rate limit'lerine dikkat edin
- Production'da environment değişkenlerini güvenli tutun
- Database backup'larını düzenli olarak alın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Web Programlama Final Projesi - 2024

# ekim_openweather
