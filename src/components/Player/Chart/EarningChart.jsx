import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

function EarningChart({ filterEarnings }) {
  const colorsEarnings = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];
  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const generateChartData = (filterEarnings) => {
    const chartData = filterEarnings.reduce(
      (data, entry) => {
        const { Date, priceFor, priceAmount } = entry;

        if (!data.labels.includes(Date)) {
          data.labels.push(Date);
          data.matchFeePrices.push(0);
          data.awardPrices.push(0);
        }

        const dateIndex = data.labels.indexOf(Date);

        if (priceFor === 'match_fee') {
          data.matchFeePrices[dateIndex] += parseFloat(priceAmount);
        } else if (priceFor === 'award') {
          data.awardPrices[dateIndex] += parseFloat(priceAmount);
        }

        return data;
      },
      {
        labels: [],
        matchFeePrices: [],
        awardPrices: [],
      }
    );

    const chartDatasets = [
      {
        label: 'Match Fee Earnings',
        backgroundColor: colorsEarnings[0],
        data: chartData.matchFeePrices,
        barThickness: 60,
        maxBarThickness: 40,
      },
      {
        label: 'Award Earnings',
        backgroundColor: colorsEarnings[1],
        data: chartData.awardPrices,
        barThickness: 60,
        maxBarThickness: 40,
      },
    ];

    return {
      labels: chartData.labels,
      datasets: chartDatasets,
    };
  };

  const chartDataFinal = generateChartData(filterEarnings);

  return (
    <Card className="common-card-box common-card-shadow transition w-100">
      <Card.Body>
        <h4 className="card-heading text-center">Earning Chart</h4>
        <Bar data={chartDataFinal} options={chartOptions} />
      </Card.Body>
    </Card>
  );
}

export default EarningChart;
