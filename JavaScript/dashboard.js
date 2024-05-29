document.addEventListener('DOMContentLoaded', (event) => {
  fetch('/data.json')
    .then(response => response.json())
    .then(data => {


      //MENAMPILKAN TYPE TRANSAKSI
      const transactionTypes = {};
      data.forEach(item => {
        if (!transactionTypes[item.Type]) {
          transactionTypes[item.Type] = 0;
        }
        transactionTypes[item.Type]++;
      });
      // Menyiapkan data untuk Chart.js
      const Transactionlabels = Object.keys(transactionTypes);
      const dataValues = Object.values(transactionTypes);

      // Ambil elemen canvas untuk chart
      const ctxTransaction = document.getElementById('typeTransaksi').getContext('2d');
      // Buat chart pie
      const transactionTypeChart = new Chart(ctxTransaction, {
        type: 'pie',
        data: {
          labels: Transactionlabels,
          datasets: [{
            label: 'Transaction Type Distribution',
            data: dataValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)', // Merah
              'rgba(54, 162, 235, 0.7)' // Biru
              
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: false
        }
      });


  //MENAMPILKAN 5 PRODUCT TERATAS
      // Mengelompokkan data berdasarkan produk dan menghitung total MQty
  const productSales = {};
  // Process data and calculate total quantity for each product
  data.forEach(item => {
    if (!productSales[item.Product]) {
      productSales[item.Product] = 0;
    }
    productSales[item.Product] += item.MQty;
  });

  // Sort products by quantity in descending order
  const sortedProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const tableBody = document.getElementById('topProduct');

  // Populate table with top 5 products
  sortedProducts.forEach(product => {
    const row = `<tr>
                  <td>${product[0]}</td>
                  <td>${product[1]}</td>
                </tr>`;
    tableBody.innerHTML += row;
  });



  //MENAMPILKAN PENJUALAN BERDASARKAN CATEGORY
      const salesData = {
        food: 0,
        carbonated: 0,
        nonCarbonated: 0,
        water: 0
      };
      data.forEach(item => {
        switch(item.Category.toLowerCase()) {
          case 'food':
            salesData.food += item.LineTotal;
            break;
          case 'carbonated':
            salesData.carbonated += item.LineTotal;
            break;
          case 'non carbonated':
            salesData.nonCarbonated += item.LineTotal;
            break;
          case 'water':
            salesData.water += item.LineTotal;
            break;
        }
      });
      const ctxCategory = document.getElementById('salesByCategory').getContext('2d');
      const salesChartCategory = new Chart(ctxCategory, {
        type: 'bar',
        data: {
          labels: ['Food', 'Carbonated', 'Non Carbonated', 'Water'],
          datasets: [{
            label: 'Sales by Category',
            data: [salesData.food, salesData.carbonated, salesData.nonCarbonated, salesData.water],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',  // Food
              'rgba(54, 162, 235, 0.2)',  // Carbonated
              'rgba(75, 192, 192, 0.2)',  // Non Carbonated
              'rgba(153, 102, 255, 0.2)'  // Water
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });


  //MENAMPILKAN PENJUALAN SETIAP MACHINE
      const groupedData = {};
      data.forEach(item => {
        if (!groupedData[item.Machine]) {
          groupedData[item.Machine] = {};
        }
        if (!groupedData[item.Machine][item.Location]) {
          groupedData[item.Machine][item.Location] = 0;
        }
        groupedData[item.Machine][item.Location] += item.LineTotal;
      });
      // Menyiapkan data untuk Chart.js
      const machinelabels = Object.keys(groupedData);
      const datasets = [];
      // Mendapatkan semua mesin unik
      const allLocation = new Set();
      machinelabels.forEach(Machine => {
        Object.keys(groupedData[Machine]).forEach(location => {
          allLocation.add(location);
        });
      });
      // Mengatur warna untuk setiap mesin
      const locationColors = {};
      Array.from(allLocation).forEach((location, index) => {
        const color = `hsl(${index * 60}, 70%, 50%)`; // Memberikan warna yang berbeda untuk setiap mesin
        locationColors[location] = color;
      });
      // Membuat dataset untuk setiap mesin
      Array.from(allLocation).forEach(location => {
        const data = machinelabels.map(machine => groupedData[machine][location] || 0);
        datasets.push({
          label: location,
          data: data,
          backgroundColor: locationColors[location],
          borderColor: locationColors[location],
          borderWidth: 1
        });
      });
      const ctxMachine = document.getElementById('chartMahcine').getContext('2d');
      const salesChartMachine = new Chart(ctxMachine, {
        type: 'bar',
        data: {
          labels: machinelabels,
          datasets: datasets
        },
        options: {
          indexAxis: 'y',
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });


  //MENAMPILKAN PENJUALAN PERKATEGORI DI BERBAGAI LOKASI
        // Mengelompokkan data berdasarkan lokasi dan kategori
        const lokasiCategory = {};
        data.forEach(item => {
          if (!lokasiCategory[item.Location]) {
            lokasiCategory[item.Location] = {};
          }
          if (!lokasiCategory[item.Location][item.Category]) {
            lokasiCategory[item.Location][item.Category] = 0;
          }
          lokasiCategory[item.Location][item.Category] += item.LineTotal;
        });
        // Menyiapkan data untuk Chart.js
        const categoryWithLokasilabels = Object.keys(lokasiCategory);
        const categoryWithLokasidatasets = [];
        // Mendapatkan semua kategori unik
        const allCategories = new Set();
        categoryWithLokasilabels.forEach(Location => {
          Object.keys(lokasiCategory[Location]).forEach(category => {
            allCategories.add(category);
          });
        });
        // Mengatur warna untuk setiap kategori
        const categoryColors = {};
        Array.from(allCategories).forEach((category, index) => {
          const color = `hsl(${index * 60}, 70%, 50%)`; // Memberikan warna yang berbeda untuk setiap kategori
          categoryColors[category] = color;
        });
        // Membuat dataset untuk setiap kategori
        Array.from(allCategories).forEach(category => {
          const data = categoryWithLokasilabels.map(Location => lokasiCategory[Location][category] || 0);
          categoryWithLokasidatasets.push({
            label: category,
            data: data,
            backgroundColor: categoryColors[category],
            borderColor: categoryColors[category],
            borderWidth: 1
          });
        });
        const ctxCategoryWithLokasi = document.getElementById('lokasiByCategory').getContext('2d');
        salesChart = new Chart(ctxCategoryWithLokasi, {
          type: 'bar',
          data: {
            labels: categoryWithLokasilabels,
            datasets: categoryWithLokasidatasets
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
  //MENAMPILKAN TOTAL PENJUALAN DI SETIAP LOKASI
      // Mengelompokkan data berdasarkan lokasi
      const groupedLokasi = {};
      data.forEach(item => {
        if (!groupedLokasi[item.Location]) {
          groupedLokasi[item.Location] = 0;
        }
        groupedLokasi[item.Location] += item.LineTotal;
      });
      // Menyiapkan data untuk Chart.js
      const lokasilabels = Object.keys(groupedLokasi);
      const dataValuesLokasi = lokasilabels.map(location => groupedLokasi[location]);
      const backgroundColors = lokasilabels.map((location, index) => {
        return `hsl(${index * 60}, 70%, 50%)`; // Memberikan warna yang berbeda untuk setiap lokasi
      });
      const canvas = document.getElementById('salesByLokasi');
      canvas.height = 242;
      const ctx = canvas.getContext('2d');
      salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: lokasilabels, // Nama lokasi di sumbu y
          datasets: [{
            data: dataValuesLokasi,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y', // Menampilkan bar horizontal
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => ({
                      text: label,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      lineWidth: data.datasets[0].borderWidth,
                      hidden: isNaN(data.datasets[0].data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                      index: i
                    }));
                  }
                  return [];
                }
              }
            }
          }
        }
      });

    })
    .catch(error => console.error('Error fetching data:', error));

});

window.onload = function(){
  const selectCountry = document.getElementById('lokasi'),
        select = document.querySelectorAll('select')
}