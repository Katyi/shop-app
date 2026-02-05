import { Client } from 'pg';

const connectionString =
  'postgresql://postgres:postgres@localhost:5439/shop-app-db?schema=public';

async function addRussian() {
  const client = new Client({ connectionString });
  await client.connect();

  // Берем ID первого попавшегося продукта
  // const res = await client.query('SELECT id FROM "product" LIMIT 1');
  // const productId = res.rows[0].id;
  const productId = '876e817c-084e-4ea4-8d73-f62499c740b5';

  // Добавляем русский перевод
  await client.query(
    `INSERT INTO "product_translation" (id, language, title, description, "productId") 
     VALUES (gen_random_uuid(), 'ru', $1, $2, $3)`,
    [
      'Приталенное платье-рубашка миди без воротника',
      'Эта модель представляет собой изысканную интерпретацию классического платья-рубашки. Изготовленное из струящейся ткани TENCEL™ Lyocell, оно имеет воротник без воротничка и завязки в тон на талии, которые подчеркивают А-образный силуэт. Небольшие боковые карманы добавляют практичности.',
      productId,
    ],
  );

  console.log('✅ Русский перевод добавлен для товара:', productId);
  await client.end();
}

addRussian();
