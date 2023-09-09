import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';

function EarningChart(props) {
  const { earningsData, chartOptions, playerData } = props;

  const colorsEarnings = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];

  const calculateEarningsLeft = () => {
    const totalEarnings = playerData?.Total_Earninig || 0;
    const approvedEarnings = playerData?.sumAprovedEarning || 0;
    return totalEarnings - approvedEarnings;
  };

  const earningsLeft = calculateEarningsLeft();

  const generateEarningsDoughnutData = () => {
    const labels = ['Match Fee', 'Awards', 'Approved', 'Amount Left'];
    const data = [
      playerData?.sumplayerEarningFee || 0,
      playerData?.sumPlayerOfAwards || 0,
      playerData?.sumAprovedEarning || 0,
      earningsLeft,
    ];
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colorsEarnings,
        },
      ],
    };
  };

  const earningsDoughnutData = generateEarningsDoughnutData();

  const generateChartData = (earningsData) => {
    const chartData = earningsData.reduce(
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
        label: 'Match Fee',
        backgroundColor: colorsEarnings[0],
        data: chartData.matchFeePrices,
        barThickness: 60,
        maxBarThickness: 40,
      },
      {
        label: 'Award',
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

  const chartDataFinal = generateChartData(earningsData);

  return (
    <>
      <Col lg={6}>
        <Card className="common-card-box common-card-shadow transition w-100">
          <Card.Body>
            <h4 className="card-heading text-center">Earning Chart</h4>
            <Bar data={chartDataFinal} options={chartOptions} />
          </Card.Body>
        </Card>
      </Col>
      {/* <Col lg={3}>
        <Card className="common-card-box common-card-shadow transition mt-4 doughnut-chart">
          <Card.Body>
            <h5 className="common-heading text-center">Earning Chart</h5>
            <Doughnut data={earningsDoughnutData} />
          </Card.Body>
        </Card>
      </Col> */}
    </>
  );
}

export default EarningChart;
