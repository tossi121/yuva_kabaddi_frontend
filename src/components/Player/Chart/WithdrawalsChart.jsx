import React from 'react';
import { Card, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

function WithdrawalsChart({ withdrawalsData, filterChart, chart }) {
  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const getRequestCountsByDate = () => {
    return withdrawalsData.reduce((counts, request) => {
      const { createdAt, status } = request;
      const date = new Date(createdAt).toISOString().split('T')[0];
      if (!counts[date]) {
        counts[date] = { pending: 0, paid: 0, rejected: 0 };
      }

      if (status === 'Pending') {
        counts[date].pending++;
      } else if (status === 'Paid') {
        counts[date].paid++;
      } else if (status === 'Reject') {
        counts[date].rejected++;
      }

      return counts;
    }, {});
  };

  const colorsWithdrawals = ['#508AA8', '#56BFE9', '#7DDFE2', '#FAA69A'];

  const requestTypes = [
    { label: 'Paid Withdrawals' },
    { label: 'Pending Withdrawals' },
    { label: 'Rejected Withdrawals' },
  ];

  const filteredRequestTypes = requestTypes.filter((type) => type.label);

  const updatedChartData = {
    labels: Object.keys(getRequestCountsByDate()), // Corrected function call here
    datasets: filteredRequestTypes.map((type, index) => ({
      label: type.label,
      data: Object.values(getRequestCountsByDate()).map(
        (counts) => counts[type.label.toLowerCase().split(' ')[0]] || 0
      ),
      backgroundColor: colorsWithdrawals[index % colorsWithdrawals.length],
      barThickness: 60,
      maxBarThickness: 40,
    })),
  };
  return (
    <Card className="common-card-box common-card-shadow transition w-100">
      <Card.Body>
        <h5 className="card-heading text-center">Withdrawals Chart</h5>
        <Bar data={(chart && filterChart) || updatedChartData} options={chartOptions} />
      </Card.Body>
    </Card>
  );
}

export default WithdrawalsChart;
