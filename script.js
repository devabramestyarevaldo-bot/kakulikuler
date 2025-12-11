document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Simulasi Data Kapasitas Terpasang ---
    const capacityOutput = document.getElementById('capacityOutput');
    if (capacityOutput) {
        const capacity = 1500000; // Contoh: 1.500.000 kWp
        capacityOutput.textContent = `${(capacity / 1000).toFixed(2)} GWp`;
    }

    // --- 2. Perbandingan Efisiensi (LCOE) ---
    const efficiencyChart = document.getElementById('efficiencyChart');
    if (efficiencyChart) {
        const efficiencyCtx = efficiencyChart.getContext('2d');

        // Data Simulasi (LCOE per kWh dalam Rupiah/USD/Unit Mata Uang)
        const efficiencyData = {
            labels: ['Surya Panel Tipe A', 'Surya Panel Tipe B', 'Angin (Onshore)', 'Biomassa', 'Batu Bara'],
            datasets: [{
                label: 'Biaya Energi (Perkiraan Satuan/kWh)',
                data: [60, 45, 55, 70, 90], // Nilai yang lebih rendah lebih efisien biaya
                backgroundColor: [
                    'rgba(255, 193, 7, 0.8)',   // Kuning (Surya A)
                    'rgba(255, 159, 64, 0.8)',  // Oranye (Surya B)
                    'rgba(40, 167, 69, 0.8)',   // Hijau (Angin)
                    'rgba(108, 117, 125, 0.8)', // Abu-abu (Biomassa)
                    'rgba(220, 53, 69, 0.8)'    // Merah (Batu Bara - sebagai pembanding)
                ],
                borderColor: [
                    '#FFC107',
                    '#FF9F40',
                    '#28A745',
                    '#6C757D',
                    '#DC3545'
                ],
                borderWidth: 1
            }]
        };

        new Chart(efficiencyCtx, {
            type: 'bar',
            data: efficiencyData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Biaya Relatif (Satuan/kWh)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'LCOE Berbagai Sumber Energi'
                    }
                }
            }
        });
    }

    // --- 3. Emisi Karbon Riil (Produksi hingga Operasional) ---
    const emissionChart = document.getElementById('emissionChart');
    if (emissionChart) {
        const emissionCtx = emissionChart.getContext('2d');

        // Data Simulasi (Emisi Karbon Total Life Cycle gCO2eq/kWh)
        const emissionData = {
            labels: ['Surya', 'Angin', 'Hidro', 'Nuklir', 'Gas Alam', 'Batu Bara'],
            datasets: [{
                label: 'gCO2eq/kWh',
                data: [48, 11, 24, 12, 490, 820], // Data dari sumber ilmiah (IPCC, dll.)
                backgroundColor: [
                    'rgba(40, 167, 69, 0.8)',   // Hijau Tua (Terbarukan rendah emisi)
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)',   // Kuning (Fosil Sedang)
                    'rgba(220, 53, 69, 0.8)'    // Merah (Fosil Tinggi)
                ],
                borderWidth: 1
            }]
        };

        new Chart(emissionCtx, {
            type: 'bar',
            data: emissionData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Emisi Karbon (gCO2eq/kWh)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Jejak Karbon Total Siklus Hidup Sumber Energi'
                    }
                }
            }
        });
    }

    // --- 4. Solar Calculator Functionality ---
    const solarCalculator = document.getElementById('solarCalculator');
    if (solarCalculator) {
        solarCalculator.addEventListener('submit', (event) => {
            event.preventDefault();
            const monthlyBill = parseFloat(document.getElementById('monthlyBill').value);
            if (isNaN(monthlyBill) || monthlyBill <= 0) {
                alert('Masukkan tagihan bulanan yang valid.');
                return;
            }

            // Assumptions for calculation:
            // Average electricity price in Indonesia: ~Rp 1,500 per kWh
            // Average solar panel output: 300W per panel, 5 hours sunlight per day
            // Efficiency factor: 0.8 (accounting for losses)
            const avgPricePerKwh = 1500; // Rp per kWh
            const panelOutputW = 300; // Watts per panel
            const sunlightHours = 5; // Hours per day
            const efficiency = 0.8;
            const daysPerMonth = 30;

            // Calculate monthly consumption in kWh
            const monthlyConsumptionKwh = (monthlyBill * 1000000) / avgPricePerKwh; // Convert to Rupiah

            // Calculate required panel capacity
            const dailyEnergyNeededKwh = monthlyConsumptionKwh / daysPerMonth;
            const requiredPanelCapacityW = (dailyEnergyNeededKwh * 1000) / (panelOutputW * sunlightHours * efficiency);
            const numPanels = Math.ceil(requiredPanelCapacityW);

            // Estimate savings (assuming solar covers 80% of consumption)
            const solarCoverage = 0.8;
            const monthlySavings = (monthlyConsumptionKwh * solarCoverage * avgPricePerKwh) / 1000000; // Back to millions

            // Display results
            const resultDiv = document.getElementById('resultOutput');
            const panelEstimate = document.getElementById('panelEstimate');
            panelEstimate.innerHTML = `
                <strong>Perkiraan Kebutuhan Panel:</strong> ${numPanels} panel surya (300W masing-masing)<br>
                <strong>Kapasitas Total:</strong> ${(numPanels * panelOutputW / 1000).toFixed(1)} kWp<br>
                <strong>Penghematan Bulanan:</strong> Rp ${monthlySavings.toFixed(2)} juta (dengan cakupan 80%)
            `;
            resultDiv.classList.remove('hidden');
            console.log('Calculator result displayed'); // Debug log
        });
    } else {
        console.log('Solar calculator form not found'); // Debug log
    }

});
