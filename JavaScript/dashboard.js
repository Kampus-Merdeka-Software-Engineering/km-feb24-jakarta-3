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
        plugins: {
          title: {
              display: true,
              text: 'Type of Transactions',
              padding: {
                bottom: 20
              },
              font: {
                size: 17,
                color: 'black'
              }
          }
      },
        responsive: true,
        maintainAspectRatio: false
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
      "ordering": true,
      "destroy": true // Ensure the table is re-initialized properly
    });

    // MENAMPILKAN PENJUALAN BERDASARKAN CATEGORY
    const predefinedOrder = ['food', 'carbonated', 'non carbonated', 'water'];

    const groupedCategories = {};
    data.forEach(item => {
        const category = item.Category.toLowerCase();
        if (!groupedCategories[category]) {
            groupedCategories[category] = 0;
        }
        groupedCategories[category] += item.MQty;
    });

    // Order categories based on predefinedOrder
    const orderedCategories = predefinedOrder.filter(category => category in groupedCategories);
    const dataValuesCategory = orderedCategories.map(category => groupedCategories[category]);

    const backgroundColorsCategory = [
        'rgba(255, 99, 132, 0.2)', // Food
        'rgba(54, 162, 235, 0.2)', // Carbonated
        'rgba(75, 192, 192, 0.2)', // Non Carbonated
        'rgba(153, 102, 255, 0.2)' // Water
    ];
    const borderColorsCategory = [
        'rgba(255, 99, 132, 1)',   // Food
        'rgba(54, 162, 235, 1)',   // Carbonated
        'rgba(75, 192, 192, 1)',   // Non Carbonated
        'rgba(153, 102, 255, 1)'   // Water
    ];

    const canvasCategory = document.getElementById('salesByCategory');
    const ctxCategory = canvasCategory.getContext('2d');
    const categoryChart = new Chart(ctxCategory, {
        type: 'bar',
        data: {
            labels: orderedCategories.map(category => category.charAt(0).toUpperCase() + category.slice(1)), // Capitalize category names
            datasets: [{
                data: dataValuesCategory,
                backgroundColor: backgroundColorsCategory,
                borderColor: borderColorsCategory,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
              legend: {
                  onClick: (e, legendItem, legend) => {
                      const index = legendItem.index;
                      const ci = legend.chart;
                      const meta = ci.getDatasetMeta(0);

                      // Toggle the visibility of the clicked label
                      meta.data[index].hidden = !meta.data[index].hidden;
                      ci.update();
                  },
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
                },
              title: {
                display: true,
                text: 'Sales by Categories',
                padding: {
                  bottom: 20
                },
                font: {
                  size: 17,
                  color: 'black'
                }
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
    
    // Mengubah label mesin menjadi format yang diinginkan
      const modifiedMachineLabels = machineLabels.map(label => {
    // Menghapus pola "x" diikuti oleh angka di belakangnya dengan regex
      const formattedMachineName = label.replace(/ x\d+/, '');
      return formattedMachineName;
    });

    const ctxMachine = document.getElementById('chartMahcine').getContext('2d');
    new Chart(ctxMachine, {
      type: 'bar',
      data: {
        labels: machineLabels,
        datasets: datasets
      },
      options: {
        plugins: {
          title: {
              display: true,
              text: 'Sales by Machine',
              padding: {
                bottom: 20
              },
              font: {
                size: 17,
                color: 'black'
              }
          }
      },
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          y: {
            beginAtZero: true,
                    // Menggunakan label yang sudah dimodifikasi
            ticks: {
              callback: function(value, index, values) {
              return modifiedMachineLabels[index];
              }
            }
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
