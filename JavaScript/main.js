// Fungsi untuk memuat data JSON
async function fetchData() {
  const response = await fetch('/vendingMachine.json');
  const dataPenjualan = await response.json();
  return dataPenjualan;
}

// Fungsi untuk mengelompokkan penjualan per minggu
function groupDataByWeek(dataPenjualan) {
  const groupedData = {};
  
  dataPenjualan.forEach(item => {
    const date = new Date(item.TransDate);
    const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;

    if (!groupedData[week]) {
      groupedData[week] = 0;
    }

    groupedData[week] += item.TransTotal;
  });

  return groupedData;
}

// Fungsi untuk mendapatkan nomor minggu dari sebuah tanggal
function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

// Fungsi untuk membuat grafik menggunakan Chart.js
async function createChart() {
  const dataPenjualan = await fetchData();

  const weeklySales = groupDataByWeek(dataPenjualan);

  const labels = Object.keys(weeklySales);
  const salesData = Object.values(weeklySales);

  const ctx = document.getElementById('chart-penjualan').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line', // jenis grafik yang ingin dibuat (bisa juga 'bar', 'pie', dll.)
    data: {
      labels: labels,
      datasets: [{
        label: 'Penjualan Vending Machine',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        data: salesData
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
// Panggil fungsi createChart untuk membuat grafik
createChart();


const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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
