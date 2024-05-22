document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
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
  
        const ctx = document.getElementById('chart0').getContext('2d');
        const salesChart = new Chart(ctx, {
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
      })
      .catch(error => console.error('Error fetching data:', error));

  });

  document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Mengelompokkan data berdasarkan lokasi dan mesin
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
        const labels = Object.keys(groupedData);
        const datasets = [];
  
        // Mendapatkan semua mesin unik
        const allLocation = new Set();
        labels.forEach(Machine => {
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
          const data = labels.map(machine => groupedData[machine][location] || 0);
          datasets.push({
            label: location,
            data: data,
            backgroundColor: locationColors[location],
            borderColor: locationColors[location],
            borderWidth: 1
          });
        });
  
        const ctx = document.getElementById('chart1').getContext('2d');
        salesChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
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
      })
      .catch(error => console.error('Error fetching data:', error));
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Mengelompokkan data berdasarkan produk dan menghitung total MQty
        const productSales = {};
  
        data.forEach(item => {
          if (!productSales[item.Product]) {
            productSales[item.Product] = 0;
          }
          productSales[item.Product] += item.MQty;
        });
  
        // Mengubah object menjadi array dan mengurutkan berdasarkan MQty
        const sortedProducts = Object.entries(productSales)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
  
        // Ambil tabel yang akan diisi
        const tableBody = document.querySelector('#chart2 tbody');
  
        // Tambahkan baris ke tabel untuk setiap produk
        sortedProducts.forEach(product => {
          const row = `<tr>
                        <td>${product[0]}</td>
                        <td>${product[1]}</td>
                      </tr>`;
          tableBody.innerHTML += row;
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });

  document.addEventListener('DOMContentLoaded', () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Menghitung distribusi tipe transaksi
        const transactionTypes = {};
        
        data.forEach(item => {
          if (!transactionTypes[item.Type]) {
            transactionTypes[item.Type] = 0;
          }
          transactionTypes[item.Type]++;
        });
  
        // Menyiapkan data untuk Chart.js
        const labels = Object.keys(transactionTypes);
        const dataValues = Object.values(transactionTypes);
  
        // Ambil elemen canvas untuk chart
        const ctx = document.getElementById('chart3').getContext('2d');
  
        // Buat chart pie
        const transactionTypeChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'Transaction Type Distribution',
              data: dataValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.7)', // Merah
                'rgba(54, 162, 235, 0.7)', // Biru
                'rgba(255, 206, 86, 0.7)' // Kuning
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true
          }
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });


  document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Mengelompokkan data berdasarkan lokasi
        const groupedData = {};
  
        data.forEach(item => {
          if (!groupedData[item.Location]) {
            groupedData[item.Location] = 0;
          }
          groupedData[item.Location] += item.LineTotal;
        });
  
        // Menyiapkan data untuk Chart.js
        const labels = Object.keys(groupedData);
        const datasets = [{
          label: 'Total',
          data: labels.map(location => groupedData[location]),
          backgroundColor: labels.map((location, index) => {
            const color = `hsl(${index * 60}, 70%, 50%)`; // Memberikan warna yang berbeda untuk setiap lokasi
            return color;
          }),
          borderColor: labels.map((location, index) => {
            const color = `hsl(${index * 60}, 70%, 50%)`; // Memberikan warna yang berbeda untuk setiap lokasi
            return color;
          }),
          borderWidth: 1
        }];
  
        const ctx = document.getElementById('chart4').getContext('2d');
        salesChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
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
      })
      .catch(error => console.error('Error fetching data:', error));
  });

  document.addEventListener('DOMContentLoaded', () => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        // Mengelompokkan data berdasarkan lokasi dan kategori
        const groupedData = {};
  
        data.forEach(item => {
          if (!groupedData[item.Location]) {
            groupedData[item.Location] = {};
          }
          if (!groupedData[item.Location][item.Category]) {
            groupedData[item.Location][item.Category] = 0;
          }
          groupedData[item.Location][item.Category] += item.LineTotal;
        });
  
        // Menyiapkan data untuk Chart.js
        const labels = Object.keys(groupedData);
        const datasets = [];
  
        // Mendapatkan semua kategori unik
        const allCategories = new Set();
        labels.forEach(Location => {
          Object.keys(groupedData[Location]).forEach(category => {
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
          const data = labels.map(Location => groupedData[Location][category] || 0);
          datasets.push({
            label: category,
            data: data,
            backgroundColor: categoryColors[category],
            borderColor: categoryColors[category],
            borderWidth: 1
          });
        });
  
        const ctx = document.getElementById('chart5').getContext('2d');
        salesChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: datasets
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });