import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString:
    'postgresql://postgres:postgres@localhost:5439/shop-app-db?schema=public', // Твоя строка из .env
});

async function runMigration() {
  try {
    await client.connect();
    console.log('🚀 Connected to database');

    // SQL-запрос: заменяет префикс во всех записях таблицы 'product',
    // кроме дефолтной картинки.
    // Мы используем REPLACE(поле, 'что ищем', 'на что меняем')
    const query = `
      UPDATE "product"
      SET img = REPLACE(img, '/uploads/', '/uploads/products/')
      WHERE img LIKE '/uploads/%' 
      AND img NOT LIKE '/uploads/products/%'
      AND img != '/uploads/default.png';
    `;

    const res = await client.query(query);
    console.log(`✅ Success! Updated ${res.rowCount} products.`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

runMigration();
