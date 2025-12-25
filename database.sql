-- ============================================
-- Ekim Karar Asistanı - PostgreSQL Veritabanı Kurulum Scripti
-- Veritabanı Adı: pvc_db
-- ============================================

-- ÖNEMLİ: Bu scripti çalıştırmadan önce veritabanını oluşturun:
-- CREATE DATABASE pvc_db;

-- ============================================
-- MEVCUT TABLOLARI SİLME (Opsiyonel - dikkatli kullanın)
-- ============================================
-- Eğer tablolar zaten varsa ve yeniden oluşturmak istiyorsanız:
-- DROP TABLE IF EXISTS planting_decisions CASCADE;
-- DROP TABLE IF EXISTS farms CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS (KULLANICILAR) TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'Uygulama kullanıcıları';
COMMENT ON COLUMN users.id IS 'Kullanıcı benzersiz kimliği';
COMMENT ON COLUMN users.email IS 'Kullanıcı e-posta adresi (benzersiz)';
COMMENT ON COLUMN users.password_hash IS 'Kullanıcı şifresinin hash değeri';
COMMENT ON COLUMN users.full_name IS 'Kullanıcı adı soyadı';
COMMENT ON COLUMN users.created_at IS 'Hesap oluşturulma tarihi';
COMMENT ON COLUMN users.updated_at IS 'Hesap güncellenme tarihi';

-- ============================================
-- 2. FARMS (TARLALAR) TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS farms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100),
    area_decare DECIMAL(10, 2) NOT NULL CHECK (area_decare > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

COMMENT ON TABLE farms IS 'Çiftçilerin tarlalarının bilgilerini tutar';
COMMENT ON COLUMN farms.id IS 'Tarla benzersiz kimliği';
COMMENT ON COLUMN farms.user_id IS 'Tarlanın sahibi kullanıcı ID (Foreign Key)';
COMMENT ON COLUMN farms.name IS 'Tarla adı';
COMMENT ON COLUMN farms.city IS 'Tarlanın bulunduğu şehir';
COMMENT ON COLUMN farms.district IS 'Tarlanın bulunduğu ilçe';
COMMENT ON COLUMN farms.crop_type IS 'Tarlada yetiştirilen ürün tipi (opsiyonel)';
COMMENT ON COLUMN farms.area_decare IS 'Tarla alanı (dekar cinsinden)';
COMMENT ON COLUMN farms.created_at IS 'Tarla kaydının oluşturulma tarihi';

-- ============================================
-- 2. PLANTING_DECISIONS (EKİM KARARLARI) TABLOSU
-- ============================================
CREATE TABLE IF NOT EXISTS planting_decisions (
    id SERIAL PRIMARY KEY,
    farm_id INTEGER NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    decision_status VARCHAR(50) NOT NULL CHECK (decision_status IN ('UYGUN', 'UYGUN_DEGIL', 'UYARI')),
    reason TEXT NOT NULL,
    weather_snapshot_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_farm
        FOREIGN KEY (farm_id)
        REFERENCES farms(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

COMMENT ON TABLE planting_decisions IS 'Hava durumuna göre alınan ekim kararları';
COMMENT ON COLUMN planting_decisions.id IS 'Karar benzersiz kimliği';
COMMENT ON COLUMN planting_decisions.farm_id IS 'Kararın alındığı tarla ID (Foreign Key)';
COMMENT ON COLUMN planting_decisions.crop_type IS 'Kararın alındığı ürün tipi';
COMMENT ON COLUMN planting_decisions.decision_status IS 'Karar durumu: UYGUN, UYGUN_DEGIL veya UYARI';
COMMENT ON COLUMN planting_decisions.reason IS 'Kararın gerekçesi/açıklaması';
COMMENT ON COLUMN planting_decisions.weather_snapshot_json IS 'Karar anındaki hava durumu verilerinin JSON formatında saklanması';
COMMENT ON COLUMN planting_decisions.created_at IS 'Kararın oluşturulma tarihi';

-- ============================================
-- 3. İNDEXLER (Performans İyileştirme)
-- ============================================

-- Users tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Farms tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_city ON farms(city);
CREATE INDEX IF NOT EXISTS idx_farms_district ON farms(district);
CREATE INDEX IF NOT EXISTS idx_farms_created_at ON farms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_farms_crop_type ON farms(crop_type) WHERE crop_type IS NOT NULL;

-- Planting_decisions tablosu için indexler
CREATE INDEX IF NOT EXISTS idx_decisions_farm_id ON planting_decisions(farm_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON planting_decisions(decision_status);
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON planting_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_crop_type ON planting_decisions(crop_type);

-- JSONB alanı için GIN index (JSON sorguları için optimize edilmiş)
CREATE INDEX IF NOT EXISTS idx_decisions_weather_json ON planting_decisions USING GIN (weather_snapshot_json);

-- Composite index (farm_id ve created_at birlikte sorgulandığında)
CREATE INDEX IF NOT EXISTS idx_decisions_farm_created ON planting_decisions(farm_id, created_at DESC);

-- ============================================
-- 4. ÖRNEK VERİLER (SEED DATA - OPSİYONEL)
-- ============================================
-- Bu bölümü isterseniz aktif edebilirsiniz

-- Örnek kullanıcı ekle (şifre: test123 - hash'i uygulama ile oluşturulmalı)
-- INSERT INTO users (email, password_hash, full_name) VALUES
-- ('test@example.com', '$2b$10$...', 'Test Kullanıcı');

-- Örnek tarlalar ekle (user_id yukarıdaki INSERT'ten sonra ayarlanmalı)
-- INSERT INTO farms (user_id, name, city, district, crop_type, area_decare) VALUES
-- (1, 'Ana Tarla', 'Ankara', 'Çankaya', 'Buğday', 50.00),
-- (1, 'Yan Tarla', 'İstanbul', 'Beylikdüzü', 'Mısır', 30.50);

-- Örnek kararlar ekle (farm_id'ler yukarıdaki INSERT'ten sonra otomatik oluşacak)
-- INSERT INTO planting_decisions (farm_id, crop_type, decision_status, reason, weather_snapshot_json) VALUES
-- (1, 'Buğday', 'UYGUN', 'Sıcaklık ve rüzgar koşulları ekim için uygun. Yağış beklenmiyor.', 
--  '{"current": {"temp": 22.5, "humidity": 65, "windSpeed": 8.2}}'),
-- (2, 'Mısır', 'UYARI', 'Rüzgar hızı yüksek. İlaçlama işlemleri için dikkatli olunmalı.',
--  '{"current": {"temp": 25.0, "humidity": 70, "windSpeed": 13.5}}');

-- ============================================
-- 5. KULLANIM TALİMATLARI
-- ============================================
-- Bu scripti çalıştırmak için:
-- 
-- 1. PostgreSQL'e bağlanın:
--    psql -U postgres
--
-- 2. Veritabanını oluşturun (eğer yoksa):
--    CREATE DATABASE pvc_db;
--
-- 3. Veritabanına bağlanın:
--    \c pvc_db
--
-- 4. Bu scripti çalıştırın:
--    \i database.sql
--    veya
--    psql -U postgres -d pvc_db -f database.sql
--
-- 5. Tabloların oluşturulduğunu kontrol edin:
--    \dt
--
-- 6. Tablo yapılarını görmek için:
--    \d farms
--    \d planting_decisions
--
-- 7. Verileri kontrol etmek için:
--    SELECT COUNT(*) FROM farms;
--    SELECT COUNT(*) FROM planting_decisions;

-- ============================================
-- 6. YARARLI SORGULAR
-- ============================================

-- Tüm tabloları listelemek için:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Tarla başına karar sayısını görmek için:
-- SELECT f.name, f.city, COUNT(d.id) as decision_count
-- FROM farms f
-- LEFT JOIN planting_decisions d ON f.id = d.farm_id
-- GROUP BY f.id, f.name, f.city
-- ORDER BY decision_count DESC;

-- Son 7 günde alınan kararları görmek için:
-- SELECT d.*, f.name as farm_name, f.city
-- FROM planting_decisions d
-- JOIN farms f ON d.farm_id = f.id
-- WHERE d.created_at >= NOW() - INTERVAL '7 days'
-- ORDER BY d.created_at DESC;

-- ============================================
-- VERİTABANI KURULUMU TAMAMLANDI
-- ============================================
