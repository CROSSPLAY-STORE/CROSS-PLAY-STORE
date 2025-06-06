<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تفاصيل المنتج</title>
  <link rel="stylesheet" href="style.css">
  <script defer src="product.js"></script>
</head>
<body>
  <header>
    <nav>
      <a href="index.html" class="logo">🎮 CrossPlay</a>
      <a href="cart.html" class="cart-icon">🛒</a>
    </nav>
  </header>

  <main class="product-detail">
    <div class="product-gallery">
      <img id="mainImage" src="" alt="صورة المنتج">
      <div class="thumbnails" id="thumbnailContainer"></div>
    </div>
    <div class="product-info">
      <h2 id="productName">اسم المنتج</h2>
      <p id="productDescription">وصف المنتج</p>
      <p id="productPrice">السعر: <span></span> ريال</p>
      <button id="addToCartBtn">إضافة إلى السلة</button>
    </div>
  </main>
</body>
</html>
