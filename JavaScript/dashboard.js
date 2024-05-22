// dashboard.js

async function fetchData() {
  // Gantilah URL ini dengan lokasi data JSON Anda
  const response = await fetch('/data.json');
  const data = await response.json();
  return data;
}
  
function groupDataByLocation(data) {
    const locationData = {};
    data.forEach(item => {
      const location = item.Location;
      if (!locationData[location]) {
        locationData[location] = 0;
      }
      locationData[location] += item.MQty; // Jumlahkan total MQty per lokasi
    });
  
    const labels = Object.keys(locationData);
    const values = Object.values(locationData);
  
    return { labels, values };
  }
  
function groupDataByMachine(data) {
    const machineData = {};
    data.forEach(item => {
      const machine = item.Machine;
      if (!machineData[machine]) {
        machineData[machine] = 0;
      }
      machineData[machine] += item.MQty; // Jumlahkan total MQty per lokasi
    });
  
    const labels = Object.keys(machineData);
    const values = Object.values(machineData);
  
    return { labels, values };
  }

  function groupDataByCategory(data) {
    const categoryData = {};
    data.forEach(item => {
      const category = item.Category;
      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += item.MQty; // Jumlahkan total MQty per lokasi
    });
  
    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);
  
    return { labels, values };
  }

  function groupDataByProduct(data) {
    const productData = {};
    data.forEach(item => {
      const product = item.Product;
      if (!productData[product]) {
        productData[product] = 0;
      }
      productData[product] += item.MQty; // Jumlahkan total transaksi per produk
    });
    return productData;
  }
  function getTop5Products(productData) {
    const sortedProducts = Object.entries(productData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  
    return sortedProducts;
  }      
  

function groupDataByMonth(data) {
    const monthlyData = {};
    data.forEach(item => {
      const [month, day, year] = item.TransDate.split('/'); // Memecah tanggal berdasarkan format mm/dd/yyyy
      const monthYear = `${month}/${year}`;
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += item.MQty; // Jumlahkan total transaksi per bulan
    });
  
    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);
  
    return { labels, values };
  }
  
async function createLocationChart() {
    const data = await fetchData();
    const { labels, values } = groupDataByLocation(data);
  
    const ctx = document.getElementById('chart0').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Penjualan Berdasarkan Lokasi',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Membuat bar chart menjadi horizontal
        scales: {
          x: { // Konfigurasi sumbu X (horizontal)
            beginAtZero: true
          }
        }
      }
    });
  }
  
async function createMachineChart() {
    const data = await fetchData();
    const { labels, values } = groupDataByMachine(data);
  
    const ctx = document.getElementById('chart1').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Penjualan Berdasarkan Vending Machine',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Membuat bar chart menjadi horizontal
        scales: {
          x: { // Konfigurasi sumbu X (horizontal)
            beginAtZero: true
          }
        }
      }
    });
  }

  async function createCategoryChart() {
    const data = await fetchData();
    const { labels, values } = groupDataByCategory(data);
  
    const ctx = document.getElementById('chart2').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Penjualan Kategori Tertinggi',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
  }

  async function displayTop5Products() {
    const data = await fetchData();
    const productData = groupDataByProduct(data);
    const top5Products = getTop5Products(productData);
  
    const tableContainer = document.getElementById('top5product');
    tableContainer.innerHTML = ''; // Kosongkan kontainer tabel sebelum menambahkan data baru
  
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
  
    // Buat header tabel
    const headerRow = document.createElement('tr');
    const headers = ['No.', 'Product', 'Total'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
  
    // Masukkan data produk ke dalam tabel
    top5Products.forEach(([product, total], index) => {
      const row = document.createElement('tr');
      const cells = [index + 1, product, total];
      cells.forEach(cellData => {
        const cell = document.createElement('td');
        cell.textContent = cellData;
        row.appendChild(cell);
      });
      tbody.appendChild(row);
    });
  
    // Gabungkan elemen-elemen tabel
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  }
  
  
  

async function createMonthlyChart() {
    const data = await fetchData();
    const { labels, values } = groupDataByMonth(data);
  
    const ctx = document.getElementById('chart4').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        datasets: [{
          label: 'Penjualan Tahun 2022',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
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
  }

document.addEventListener('DOMContentLoaded', () => {
    createLocationChart();
    createMachineChart();
    createCategoryChart();
    displayTop5Products()
    createMonthlyChart();
  });
  