// Fungsi untuk mengambil data JSON
async function fetchData() {
  const response = await fetch('./data.json');
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


// FILTER SCORE CARD
async function fetchData() {
  const response = await fetch('./data.json');
  const data = await response.json();
  return data;
}

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

// Fungsi untuk memfilter data berdasarkan pilihan
function filterData(data, location, machine, category) {
  return data.filter(item => {
      return (location === "" || item.Location === location) &&
             (machine === "" || item.Machine === machine) &&
             (category === "" || item.Category === category);
  });
}

// Fungsi untuk memperbarui scorecard
async function updateScorecards() {
  const data = await fetchData();

  const location = document.getElementById('lokasiMonitoring').value;
  const machine = document.getElementById('machineMonitoring').value;
  const category = document.getElementById('categoryMonitoring').value;

  const filteredData = filterData(data, location, machine, category);

  // Menghitung dan menampilkan data untuk scorecard
  const uniqueProducts = {};
  let totalMqty = 0;
  let totalTransactions = 0;
  let totalRprice = 0;

  filteredData.forEach(item => {
      uniqueProducts[item.Product] = true;
      totalMqty += item.MQty;
      totalTransactions += 1;
      totalRprice += item.RPrice * item.RQty;
  });

  const totalUniqueProducts = Object.keys(uniqueProducts).length;
  document.getElementById('valueProduct').textContent = `${totalUniqueProducts}`;
  document.getElementById('valueMqty').textContent = `${formatNumber(totalMqty)}`;
  document.getElementById('valueTransaction').textContent = `${formatNumber(totalTransactions)}`;
  document.getElementById('valueRprice').textContent = `${formatNumber(totalRprice)}`;
}

// Event listeners untuk dropdown
document.getElementById('lokasiMonitoring').addEventListener('change', updateScorecards);
document.getElementById('machineMonitoring').addEventListener('change', updateScorecards);
document.getElementById('categoryMonitoring').addEventListener('change', updateScorecards);

// Panggil fungsi untuk memperbarui scorecard pada saat halaman dimuat
updateScorecards();