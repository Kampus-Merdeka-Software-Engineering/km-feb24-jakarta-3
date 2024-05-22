// Fungsi untuk mengambil data JSON
async function fetchData() {
  const response = await fetch('/data.json');
  const data = await response.json();
  return data;
}

// Fungsi untuk mengelompokkan data berdasarkan minggu
function groupDataByWeek(data) {
  const weeks = {};

  data.forEach(item => {
      const date = new Date(item.TransDate);
      const year = date.getFullYear();
      const week = getWeekNumber(date);

      const weekKey = `${year}-W${week}`;

      if (!weeks[weekKey]) {
          weeks[weekKey] = 0;
      }

      weeks[weekKey] += item.TransTotal;
  });

  return weeks;
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Fungsi untuk mengelompokkan data berdasarkan bulan
function groupDataByMonth(data) {
  const months = {};
  data.forEach(item => {
      const [month, day, year] = item.TransDate.split('/');
      const monthKey = `${year}-${month.padStart(2, '0')}`;
      if (!months[monthKey]) {
          months[monthKey] = 0;
      }
      months[monthKey] += item.TransTotal;
  });
  return months;
}

// Fungsi untuk mendapatkan nomor minggu dalam tahun
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Variabel untuk menyimpan chart instance
let myChart;

// Fungsi untuk menginisialisasi atau memperbaharui grafik
async function updateChart(groupByFunction) {
  const data = await fetchData();

  // Mengelompokkan data menggunakan fungsi yang diberikan
  const groupedData = groupByFunction(data);

    // Memisahkan label dan nilai dari data yang dikelompokkan
    const labels = Object.keys(groupedData).map(label => {
      if (groupByFunction === groupDataByMonth) {
          const [year, month] = label.split('-');
          return `${monthNames[parseInt(month) - 1]} ${year}`;
      }
      return label;
    });
    const values = Object.values(groupedData);

  // // Memisahkan label dan nilai dari data yang dikelompokkan
  // const labels = Object.keys(groupedData);
  // const values = Object.values(groupedData);

      // Jika chart sudah ada, maka hapus dulu
      if (myChart) {
        myChart.destroy();
    }

  // Membuat chart menggunakan Chart.js
  const ctx = document.getElementById('chartPenjualan').getContext('2d');
  myChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Total Transaksi',
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

// Event listeners untuk tombol
document.getElementById('btnWeekly').addEventListener('click', () => {
  updateChart(groupDataByWeek);
});

document.getElementById('btnMonthly').addEventListener('click', () => {
  updateChart(groupDataByMonth);
});

// Panggil fungsi untuk membuat chart awal dengan tampilan mingguan
updateChart(groupDataByWeek);


//MENAMPILKAN SCORE CARD PRODUCT
document.addEventListener('DOMContentLoaded', () => {
  fetch('/data.json')
      .then(response => response.json())
      .then(data => {
          // Melacak produk yang unik
          const uniqueProducts = {};

          data.forEach(item => {
              uniqueProducts[item.Product] = true;
          });

          // Menghitung jumlah produk yang unik
          const totalUniqueProducts = Object.keys(uniqueProducts).length;

          // Menampilkan jumlah produk yang unik
          const totalProductsContainer = document.getElementById('valueProduct');
          totalProductsContainer.textContent = `${totalUniqueProducts}`;
      })
      .catch(error => console.error('Error fetching data:', error));
});


//MENAMPILKAN SCORE CARD MQTY
// Fungsi untuk mengonversi angka menjadi format yang disingkat
function formatNumber(number) {
  if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
  } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
  } else {
      return number;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          // Menghitung jumlah total MQty dari semua produk
          let totalMqty = data.reduce((accumulator, item) => {
              return accumulator + item.MQty;
          }, 0);

          // Menampilkan jumlah total MQty dengan format singkat
          const totalMqtyContainer = document.getElementById('valueMqty');
          totalMqtyContainer.textContent = `${formatNumber(totalMqty)}`;
      })
      .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  const transactionCountElement = document.getElementById('transaction-count');

  // Fetch the JSON data
  fetch('data.json')
      .then(response => response.json())
      .then(data => {
          // Assuming data is an array of transaction objects
          const transactions = Array.isArray(data) ? data : [data];
          const transactionCount = transactions.length;

          // Update the scorecard with the transaction count
          transactionCountElement.textContent = transactionCount;
      })
      .catch(error => {
          console.error('Error fetching the JSON data:', error);
      });
});
