document.addEventListener('DOMContentLoaded', (event) => {
  let rawData = []; // Memungkinkan penyaringan ulang ketika lokasi berubah

  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      rawData = data;
      updateDashboard(data);

      // Event listener untuk filter lokasi
      const lokasiDashboard = document.getElementById('lokasiDashboard');
      lokasiDashboard.addEventListener('change', (event) => {
        const selectedLocation = event.target.value;
        let filteredData = rawData;
        if (selectedLocation !== 'all') {
          filteredData = rawData.filter(item => item.Location === selectedLocation);
        }
        updateDashboard(filteredData);
      });
    })
    .catch(error => console.error('Error fetching data:', error));

  function updateDashboard(data) {
    // Reset canvas elements
    resetCanvas('typeTransaksi');
    resetCanvas('salesByCategory');
    resetCanvas('chartMahcine');

    // MENAMPILKAN TYPE TRANSAKSI
    const transactionTypes = {};
    data.forEach(item => {
      if (!transactionTypes[item.Type]) {
        transactionTypes[item.Type] = 0;
      }
      transactionTypes[item.Type]++;
    });
    const transactionLabels = Object.keys(transactionTypes);
    const dataValues = Object.values(transactionTypes);
    const ctxTransaction = document.getElementById('typeTransaksi').getContext('2d');
    new Chart(ctxTransaction, {
      type: 'pie',
      data: {
        labels: transactionLabels,
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
        responsive: true
      }
    });

    // MENAMPILKAN 5 PRODUCT TERATAS
    const locationProductSales = {};
    data.forEach(item => {
      if (!locationProductSales[item.Location]) {
        locationProductSales[item.Location] = {};
      }
      if (!locationProductSales[item.Location][item.Product]) {
        locationProductSales[item.Location][item.Product] = 0;
      }
      locationProductSales[item.Location][item.Product] += item.MQty;
    });

    const topProductsByLocation = [];
    Object.keys(locationProductSales).forEach(location => {
      const products = Object.entries(locationProductSales[location])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      products.forEach(product => {
        topProductsByLocation.push({
          location: location,
          product: product[0],
          quantity: product[1]
        });
      });
    });

    const tableBody = document.querySelector('#topProduct tbody');
    tableBody.innerHTML = ''; // Clear the previous data
    topProductsByLocation.forEach(item => {
      const row = `<tr>
                    <td>${item.location}</td>
                    <td>${item.product}</td>
                    <td>${item.quantity}</td>
                  </tr>`;
      tableBody.innerHTML += row;
    });

    $('#topProduct').DataTable({
      "pageLength": 5,
      "lengthChange": false,
      "searching": false,
      "ordering": false,
      "destroy": true // Ensure the table is re-initialized properly
    });

    // MENAMPILKAN PENJUALAN BERDASARKAN CATEGORY
    const salesData = {
      food: 0,
      carbonated: 0,
      nonCarbonated: 0,
      water: 0
    };
    data.forEach(item => {
      switch(item.Category.toLowerCase()) {
        case 'food':
          salesData.food += item.MQty;
          break;
        case 'carbonated':
          salesData.carbonated += item.MQty;
          break;
        case 'non carbonated':
          salesData.nonCarbonated += item.MQty;
          break;
        case 'water':
          salesData.water += item.MQty;
          break;
      }
    });
    const ctxCategory = document.getElementById('salesByCategory').getContext('2d');
    new Chart(ctxCategory, {
      type: 'bar',
      data: {
        labels: ['Food', 'Carbonated', 'Non Carbonated', 'Water'],
        datasets: [{
          label: 'Sales by Category',
          data: [salesData.food, salesData.carbonated, salesData.nonCarbonated, salesData.water],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
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
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // MENAMPILKAN PENJUALAN SETIAP MACHINE
    const groupedData = {};
    data.forEach(item => {
      if (!groupedData[item.Machine]) {
        groupedData[item.Machine] = {};
      }
      if (!groupedData[item.Machine][item.Location]) {
        groupedData[item.Machine][item.Location] = 0;
      }
      groupedData[item.Machine][item.Location] += item.MQty;
    });
    const machineLabels = Object.keys(groupedData);
    const datasets = [];
    const allLocation = new Set();
    machineLabels.forEach(machine => {
      Object.keys(groupedData[machine]).forEach(location => {
        allLocation.add(location);
      });
    });
    const locationColors = {};
    Array.from(allLocation).forEach((location, index) => {
      const color = `hsl(${index * 60}, 70%, 50%)`;
      locationColors[location] = color;
    });
    Array.from(allLocation).forEach(location => {
      const data = machineLabels.map(machine => groupedData[machine][location] || 0);
      datasets.push({
        label: location,
        data: data,
        backgroundColor: locationColors[location],
        borderColor: locationColors[location],
        borderWidth: 1
      });
    });
    const ctxMachine = document.getElementById('chartMahcine').getContext('2d');
    new Chart(ctxMachine, {
      type: 'bar',
      data: {
        labels: machineLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  function resetCanvas(id) {
    const canvas = document.getElementById(id);
    const parent = canvas.parentNode;
    parent.removeChild(canvas);
    const newCanvas = document.createElement('canvas');
    newCanvas.id = id;
    parent.appendChild(newCanvas);
  }
});
