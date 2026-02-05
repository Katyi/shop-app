import axios from 'axios';
import FormData from 'form-data';

async function fill() {
  const categories = ['men', 'women', 'accessories', 'kids'];
  const colors = ['white', 'black', 'red', 'blue', 'yellow', 'green', 'pink'];
  const sizes = ['xs', 's', 'm', 'l', 'xl'];

  const TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMDA4ZDM0MS03ZDdlLTRlMmMtODExZS1hY2E4OGY0NDM3ZjgiLCJlbWFpbCI6ImFsZXhAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzY2ODQ1NzU3LCJleHAiOjE3NjY4NDkzNTd9.7ij9VNsprFTrDe60zuLhqI8kSkZSGwZ2OkucZ3UyYzU'.trim();

  for (let i = 1; i <= 30; i++) {
    try {
      const data = new FormData();
      // const product = {
      //   title: `Product ${i}`,
      //   description: `This is high quality product number ${i}`,
      //   img: '/uploads/defaultProduct.png',
      //   categories: [categories[Math.floor(Math.random() * categories.length)]],
      //   size: [sizes[Math.floor(Math.random() * sizes.length)]],
      //   color: [colors[Math.floor(Math.random() * colors.length)]],
      //   price: Math.floor(Math.random() * 100) + 10,
      //   inStock: true,
      // };

      data.append('title', `Product ${i}`);
      data.append('description', `This is high quality product number ${i}`); // Проверь desc vs description
      data.append('price', (Math.floor(Math.random() * 100) + 10).toString());
      categories.slice(0, 1).forEach((cat) => data.append('categories[]', cat));
      data.append('color[]', colors[Math.floor(Math.random() * colors.length)]);
      data.append('size[]', sizes[Math.floor(Math.random() * sizes.length)]);

      // await axios.post('http://localhost:3000/api/products', product, {
      //   headers: { Authorization: `Bearer ${TOKEN}` },
      // });

      await axios.post('http://localhost:3000/api/products', data, {
        headers: {
          ...data.getHeaders(),
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      console.log(`Added product ${i}`);
    } catch (err) {
      console.error(
        `Error adding product ${i}:`,
        err.response?.data || err.message,
      );
    }
  }
}

fill();
