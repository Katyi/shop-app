import pkg from 'pg';
const { Client } = pkg;

const connectionString =
  'postgresql://postgres:postgres@localhost:5439/shop-app-db?schema=public';

async function migrate() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('🚀 Подключились к базе!');

    // В Prisma написано @@map("product"), значит в базе это "product"
    const res = await client.query(
      'SELECT id, title, description FROM "product"',
    );
    const products = res.rows;

    console.log(`Найдено товаров: ${products.length}. Копирую...`);

    for (const product of products) {
      // Для ProductTranslation ты не указывала @@map,
      // значит Prisma создала её как "ProductTranslation"
      await client.query(
        `INSERT INTO "product_translation" (id, language, title, description, "productId") 
         VALUES (gen_random_uuid(), 'en', $1, $2, $3)
         ON CONFLICT ("productId", language) DO NOTHING`,
        [product.title, product.description || '', product.id],
      );
    }

    console.log('✅ Данные успешно перенесены в "productTranslation"!');
  } catch (err) {
    console.error('❌ Ошибка:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
