// dashboard.js

async function fetchData() {
  // Gantilah URL ini dengan lokasi data JSON Anda
  const response = await fetch('/data.json');
  const data = await response.json();
  return data;
}

function groupDataByMonth(data) {
  const monthlyData = {};
  data.forEach(item => {
      const [month, day, year] = item.prcdDate.split('/'); // Memecah tanggal berdasarkan format mm/dd/yyyy

      const monthYear = `${month}/${year}`;
      if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += item.TransTotal; // Jumlahkan total transaksi per bulan
  });

  const labels = Object.keys(monthlyData);
  const values = Object.values(monthlyData);

  return { labels, values };
}

async function updateDashboardChart() {
  const data = await fetchData();
  const { labels, values } = groupDataByMonth(data);

  // Hapus chart yang ada jika sudah ada sebelumnya
  if (window.myChart) {
      window.myChart.destroy();
  }

  // Buat chart baru
  const ctx = document.getElementById('chart0').getContext('2d');
  window = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'Total Transaksi per Bulan',
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

// Panggil fungsi updateDashboardChart() untuk membuat chart pertama kali saat halaman dimuat
updateDashboardChart();
