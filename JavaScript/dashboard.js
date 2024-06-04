document.addEventListener('DOMContentLoaded', (event) => {
  fetch('./data.json')
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
          .sort((a, b) => b[1] - a[1]) // Sort products by quantity in descending order
          .slice(0, 5); // Get top 5 products
        products.forEach(product => {
          topProductsByLocation.push({
            location: location,
            product: product[0],
            quantity: product[1]
          });
        });
      });
  
      const tableBody = document.querySelector('#topProduct tbody');
  
      // Populate table with top products by location
      topProductsByLocation.forEach(item => {
        const row = `<tr>
                      <td>${item.location}</td>
                      <td>${item.product}</td>
                      <td>${item.quantity}</td>
                    </tr>`;
        tableBody.innerHTML += row;
      });
  
    // Initialize DataTable with pagination
    $(document).ready(function() {
      $('#topProduct').DataTable({
        "pageLength": 5, // Show 5 entries per page
        "lengthChange": false, // Disable length change
        "searching": false, // Disable searching
        "ordering": false // Disable ordering
      });
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
    })
    .catch(error => console.error('Error fetching data:', error));

});
