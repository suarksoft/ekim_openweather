# Render Deployment Ayarları

## Build & Start Komutları

- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** (boş bırakın)

## Environment Variables

Render dashboard'unda "Environment" sekmesine gidin ve şu değişkenleri ekleyin:

```
NODE_ENV=production
PORT=10000

# Database Configuration (Render PostgreSQL kullanıyorsanız, otomatik olarak eklenir)
DATABASE_HOST=your_database_host
DATABASE_PORT=5432
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=pvc_db

# Veya tek bir connection string kullanmak isterseniz:
# DATABASE_URL=postgresql://user:password@host:port/database_name

# OpenWeatherMap API
WEATHER_API_KEY=8b490c055e6d8f061b3034aa7cf80f87
WEATHER_API_URL=https://api.openweathermap.org/data/2.5

# Session Secret (önemli - güvenli bir değer kullanın!)
SESSION_SECRET=your-very-secure-random-secret-key-change-this-in-production
```

## Render PostgreSQL Kullanıyorsanız

1. Render'da yeni bir PostgreSQL database oluşturun
2. Database'in "Connections" sekmesinden connection string'i kopyalayın
3. Environment variables'a ekleyin (otomatik eklenebilir)

## Önemli Notlar

1. **PORT**: Render otomatik olarak PORT environment variable'ı ekler, kodumuz bunu zaten destekliyor
2. **SESSION_SECRET**: Production için mutlaka güçlü, rastgele bir değer kullanın
3. **Database**: İlk deploy'dan önce PostgreSQL database'i oluşturun ve `database.sql` scriptini çalıştırın
4. **HTTPS**: Render otomatik HTTPS sağlar, session cookie'leri güvenli olacak

## Veritabanı Kurulumu

Render PostgreSQL kullandıktan sonra:

1. Database'in "Connect" butonuna tıklayın
2. "External Connection" bilgilerini alın veya psql ile bağlanın
3. `database.sql` dosyasını çalıştırın:
   ```bash
   psql "postgresql://user:pass@host:port/dbname" -f database.sql
   ```

Veya Render'in internal connection bilgilerini kullanarak web servisinizden bağlanabilirsiniz.

