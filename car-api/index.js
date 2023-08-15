const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Função para obter os dados do arquivo car-list.json
function getCarListData() {
  const carListData = fs.readFileSync('car-list.json');
  return JSON.parse(carListData);
}

// Endpoint para retornar a marca com mais modelos
app.get('/marcas/maisModelos', (req, res) => {
  const carList = getCarListData();

  let maxModelCount = -Infinity;
  let brandsWithMostModels = [];

  carList.forEach((car) => {
    const modelCount = car.models.length;

    if (modelCount > maxModelCount) {
      maxModelCount = modelCount;
      brandsWithMostModels = [car.brand];
    } else if (modelCount === maxModelCount) {
      brandsWithMostModels.push(car.brand);
    }
  });

  res.send(brandsWithMostModels);
});

// Endpoint para retornar a marca com menos modelos
app.get('/marcas/menosModelos', (req, res) => {
  const carList = getCarListData();

  let minModelCount = Infinity;
  let brandsWithLeastModels = [];

  carList.forEach((car) => {
    const modelCount = car.models.length;

    if (modelCount < minModelCount) {
      minModelCount = modelCount;
      brandsWithLeastModels = [car.brand];
    } else if (modelCount === minModelCount) {
      brandsWithLeastModels.push(car.brand);
    }
  });

  res.send(brandsWithLeastModels);
});

// Endpoint para retornar as X marcas com mais modelos
app.get('/marcas/listaMaisModelos/:X', (req, res) => {
  const X = parseInt(req.params.X);
  const carList = getCarListData();

  const sortedBrands = carList.sort((a, b) => {
    if (a.models.length === b.models.length) {
      return a.brand.localeCompare(b.brand);
    }
    return b.models.length - a.models.length;
  });

  const topXBrands = sortedBrands.slice(0, X);
  const result = topXBrands.map((brand) => `${brand.brand} - ${brand.models.length}`);

  res.send(result);
});

// Endpoint para retornar as X marcas com menos modelos
app.get('/marcas/listaMenosModelos/:X', (req, res) => {
  const X = parseInt(req.params.X);
  const carList = getCarListData();

  const sortedBrands = carList.sort((a, b) => {
    if (a.models.length === b.models.length) {
      return a.brand.localeCompare(b.brand);
    }
    return a.models.length - b.models.length;
  });

  const topXBrands = sortedBrands.slice(0, X);
  const result = topXBrands.map((brand) => `${brand.brand} - ${brand.models.length}`);

  res.send(result);
});

// Endpoint para retornar a lista de modelos de uma marca
app.post('/marcas/listaModelos', express.json(), (req, res) => {
  const brandName = req.body.nomeMarca;
  const carList = getCarListData();

  const lowercaseBrandName = brandName.toLowerCase();
  const brand = carList.find((car) => car.brand.toLowerCase() === lowercaseBrandName);

  if (brand) {
    res.send(brand.models);
  } else {
    res.send([]);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
