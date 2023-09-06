import React, { useEffect, useRef, useState } from 'react';
import CustomDataTable from '../DataTable/CustomDataTable';
import { Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const WithdrawalModal = dynamic(import('./WithdrawalModal'));
const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function ViewPriceMoney() {
  const dataWithdrawal = [
    {
      id: 1,
      amount: 30000,
      status: 'Reject',
      withdrawal_date: '2023-08-10',
    },
    {
      id: 2,
      amount: 150.0,
      status: 'Reject',
      withdrawal_date: '2023-08-11',
    },
    {
      id: 3,
      amount: 15000,
      status: 'Reject',
      withdrawal_date: '2023-08-12',
    },
    {
      id: 4,
      amount: 1500.0,
      status: 'Reject',
      withdrawal_date: '2023-08-12',
    },
    {
      id: 5,
      amount: 30000,
      status: 'Pending',
      withdrawal_date: '2023-08-15',
    },
    {
      id: 6,
      amount: 150.0,
      status: 'Paid',
      withdrawal_date: '2023-08-17',
    },
    {
      id: 7,
      amount: 150000,
      status: 'Reject',
      withdrawal_date: '2023-08-17',
    },
    {
      id: 8,
      amount: 300.0,
      status: 'Paid',
      withdrawal_date: '2023-08-20',
    },
    {
      id: 9,
      amount: 215000,
      status: 'Pending',
      withdrawal_date: '2023-08-24',
    },
    {
      id: 10,
      amount: 225.0,
      status: 'Reject',
      withdrawal_date: '2023-08-25',
    },
    {
      id: 11,
      amount: 330000,
      status: 'Paid',
      withdrawal_date: '2023-08-28',
    },
    {
      id: 12,
      amount: 150.0,
      status: 'Pending',
      withdrawal_date: '2023-08-30',
    },
    {
      id: 13,
      amount: 30000,
      status: 'Paid',
      withdrawal_date: '2023-09-02',
    },
    {
      id: 14,
      amount: 30000,
      status: 'Pending',
      withdrawal_date: '2023-09-05',
    },
  ];

  const data = [
    {
      id: 1,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 2',
      amount: 30000,
      winning_date: '2023-08-10',
    },
    {
      id: 2,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 6',
      amount: 150.0,
      winning_date: '2023-08-11',
    },
    {
      id: 3,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 8',
      amount: 15000,
      winning_date: '2023-08-12',
    },
    {
      id: 4,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 8',
      amount: 1500.0,
      winning_date: '2023-08-12',
    },
    {
      id: 5,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 19',
      amount: 30000,
      winning_date: '2023-08-15',
    },
    {
      id: 6,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 23',
      amount: 150.0,
      winning_date: '2023-08-17',
    },
    {
      id: 7,
      pricing_category: 'BEST DEFENDER OF THE MATCH',
      match_number: 'Match 23',
      amount: 150000,
      winning_date: '2023-08-17',
    },
    {
      id: 8,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 28',
      amount: 300.0,
      winning_date: '2023-08-20',
    },
    {
      id: 9,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 35',
      amount: 215000,
      winning_date: '2023-08-24',
    },
    {
      id: 10,
      pricing_category: 'SURVIVAL ROUND-TIE, STARTING 7',
      match_number: 'Match 37',
      amount: 225.0,
      winning_date: '2023-08-25',
    },
    {
      id: 11,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 41',
      amount: 330000,
      winning_date: '2023-08-28',
    },
    {
      id: 12,
      pricing_category: 'SURVIVAL ROUND-LOSING TEAM, STARTING 7',
      match_number: 'Match 43',
      amount: 150.0,
      winning_date: '2023-08-30',
    },
    {
      id: 13,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 49',
      amount: 30000,
      winning_date: '2023-09-02',
    },
    {
      id: 14,
      pricing_category: 'SURVIVAL ROUND-WINNING TEAM, STARTING 7',
      match_number: 'Match 53',
      amount: 30000,
      winning_date: '2023-09-05',
    },
  ];

  const columnsWithdrawal = [
    { heading: 'Withdrawal Date', field: 'withdrawal_date' },
    { heading: 'Withdrawal Amount', field: 'amount' },
    { heading: 'Status', field: 'status' },
  ];

  const columns = [
    { heading: 'Pricing Category', field: 'pricing_category' },
    { heading: 'Match Number', field: 'match_number' },
    { heading: 'Winning Date', field: 'winning_date' },
    { heading: 'Amount', field: 'amount' },
  ];

  const [totalAmount, setTotalAmount] = useState('');
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [showTableData, setShowTableData] = useState(true);
  const [filteredData, setFilteredData] = useState(dataWithdrawal);
  const [tableFilter, setTableFilter] = useState(data);
  const tableRef = useRef(null);
  const router = useRouter();
  const { label } = router.query;

  useEffect(() => {
    if (label) {
      setShowTableData(true);
      setShowTable(false);
    }
    if (label === 'Paid Earnings') {
      setFilteredData(dataWithdrawal.filter((item) => item.status === 'Paid'));
    } else if (label === 'Pending Earnings') {
      setFilteredData(dataWithdrawal.filter((item) => item.status === 'Pending'));
    } else if (label === 'Rejected Earnings') {
      setFilteredData(dataWithdrawal.filter((item) => item.status === 'Reject'));
    } else {
      setFilteredData(dataWithdrawal);
    }
  }, [label, showTable, showTableData]);

  const [selectedFilters, setSelectedFilters] = useState({
    paid: true,
    pending: true,
    reject: true,
  });

  const tableOptions = {
    columns: {
      render: {
        winning_date: renderMatchDate,
      },
    },
  };

  function renderMatchDate(value, row) {
    return <span>{moment(row.winning_date).format('DD-MMMM-YYYY')} </span>;
  }

  const tableOptionsWithdrawal = {
    columns: {
      render: {
        withdrawal_date: renderWithdrawalDate,
        status: renderSatus,
      },
    },
  };

  function renderWithdrawalDate(value, row) {
    return <span>{moment(row.withdrawal_date).format('DD-MMMM-YYYY')} </span>;
  }

  function renderSatus(value, row) {
    const statusColors = {
      Paid: 'success',
      Reject: 'danger',
      Pending: 'warning',
    };

    return (
      <>
        <Badge pill bg={statusColors[row.status]} className="fs-12">
          {row.status}
        </Badge>
      </>
    );
  }

  const handleFilterChange = (filterName) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  // Handle reset form
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setTableFilter(data);
    setFilteredData(dataWithdrawal);
  };

  const handleDownload = () => {
    const table = tableRef.current;
    const rows = table.getElementsByTagName('tr');

    let excelData =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Excel Sheet</title></head><body><table>';

    // Add table headings
    const headerRow = table.querySelector('thead tr');
    if (headerRow) {
      excelData += '<tr>';
      const headerCols = headerRow.getElementsByTagName('th');
      for (let j = 0; j < headerCols.length; j++) {
        excelData += '<th>' + headerCols[j].textContent + '</th>';
      }
      excelData += '</tr>';
    }

    // Add table data
    for (let i = 0; i < rows.length; i++) {
      const cols = rows[i].getElementsByTagName('td');
      excelData += '<tr>';
      for (let j = 0; j < cols.length; j++) {
        excelData += '<td>' + cols[j].textContent + '</td>';
      }
      excelData += '</tr>';
    }

    excelData += '</table></body></html>';

    const blob = new Blob([excelData], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'View Price Money.xlsx';
    link.click();
  };

  useEffect(() => {
    handleToggleData();
    setTotalAmount('15725');
  }, []);

  function handleToggleData() {
    setShowTableData(false);
    setShowTable(true);
    handleReset();
  }

  function handleToggle() {
    setShowTableData(true);
    setShowTable(false);
    if (!label) {
      handleReset();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const filteredDataForTable1 = data.filter((item) => {
      const isWithinDateRange =
        (!startDate || moment(item.winning_date).isSameOrAfter(startDate)) &&
        (!endDate || moment(item.winning_date).isSameOrBefore(endDate));

      if (!isWithinDateRange) {
        return false;
      }

      return true;
    });

    const filteredDataForTable2 = dataWithdrawal.filter((item) => {
      const isWithinDateRange =
        (!startDate || moment(item.withdrawal_date).isSameOrAfter(startDate)) &&
        (!endDate || moment(item.withdrawal_date).isSameOrBefore(endDate));

      if (!isWithinDateRange) {
        return false;
      }

      if (selectedFilters.paid && item.status === 'Paid') {
        return true;
      }
      if (selectedFilters.pending && item.status === 'Pending') {
        return true;
      }
      if (selectedFilters.reject && item.status === 'Reject') {
        return true;
      }
      return false;
    });

    setTableFilter(filteredDataForTable1);
    setFilteredData(filteredDataForTable2);
  };

  return (
    <>
      <WithdrawalModal
        {...{
          totalAmount,
          show,
          setShow,
        }}
      />
      <section className="dashboard-section">
        <Container fluid>
          <Row className="my-4">
            <Col lg={12}>
              <div className="mb-4">
                <DashboardBreadcrumb breadcrumbTitle="View Price Money" data={'Dashboard'} />
              </div>
              <Card className="bg-white rounded-4 card-border">
                <Card.Body className="box-padding">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="common-heading">Rajendra Bhakar</h5>
                      <div className="d-flex align-items-center">
                        <div>
                          <h6 className="section-subtitle">Total Earning:</h6>
                          <h6 className="section-subtitle">Match Fee Earnings:</h6>
                          <h6 className="section-subtitle">Award Earnings:</h6>
                        </div>
                        <div className="ms-4">
                          <h6 className="section-subtitle">&#8377;15,725.00</h6>
                          <h6 className="section-subtitle">&#8377;6,725.00</h6>
                          <h6 className="section-subtitle">&#8377;9,000.00</h6>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button className="common-btn" onClick={() => setShow(true)}>
                        Withdraw Amount
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center mb-4">
                  <Button
                    className={`rounded-2 me-3 ${(showTable && 'common-btn') || 'common-outline-btn'}`}
                    onClick={handleToggleData}
                  >
                    Earnings
                  </Button>
                  <Button
                    className={`rounded-2 me-3 ${(showTableData && 'common-btn') || 'common-outline-btn'}`}
                    onClick={handleToggle}
                  >
                    Withdrawals
                  </Button>
                </div>
                <Button
                  className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                  onClick={toggleFilterBox}
                >
                  <FontAwesomeIcon icon={faFilter} className="fs-18" />
                </Button>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Withdrawal Requests Filter</h4>
                </div>

                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xl={3} lg={4} md={6}>
                        <Form.Label className="fs-16 fw-400 base-color-1">Select Start Date</Form.Label>
                        <div className="mb-2 d-flex flex-column">
                          <ReactDatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="Select Start Date"
                            showTimeSelect={false}
                            minDate={startDate}
                            dateFormat="dd-MMM-yyyy"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          />
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-2">
                          <Form.Group className="d-flex flex-column">
                            <Form.Label className="fs-16 fw-400 base-color-1">Select End Date</Form.Label>
                            <ReactDatePicker
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              placeholderText="Select End Date"
                              showTimeSelect={false}
                              dateFormat="dd-MMM-yyyy"
                              className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                            />
                          </Form.Group>
                        </div>
                      </Col>
                      {!showTable && (
                        <Col xl={3} lg={4} md={6}>
                          <div className="mb-4">
                            <Form.Group>
                              <Form.Label className="fs-14 fw-500 base-color-2"> Filter Status</Form.Label>
                              <div className="mt-2">
                                <Form.Label className="cursor-pointer user-select-none base-color-2" htmlFor="paid">
                                  <input
                                    type="checkbox"
                                    name="paid"
                                    id="paid"
                                    className="me-2"
                                    checked={selectedFilters.paid}
                                    onChange={() => handleFilterChange('paid')}
                                  />
                                  Paid
                                </Form.Label>
                                <Form.Label
                                  className="cursor-pointer user-select-none base-color-2 mx-3"
                                  htmlFor="pending"
                                >
                                  <input
                                    type="checkbox"
                                    name="pending"
                                    id="pending"
                                    className="me-2"
                                    checked={selectedFilters.pending}
                                    onChange={() => handleFilterChange('pending')}
                                  />
                                  Pending
                                </Form.Label>
                                <Form.Label className="cursor-pointer user-select-none base-color-2" htmlFor="reject">
                                  <input
                                    type="checkbox"
                                    name="reject"
                                    id="reject"
                                    className="me-2"
                                    checked={selectedFilters.reject}
                                    onChange={() => handleFilterChange('reject')}
                                  />
                                  Reject
                                </Form.Label>
                              </div>
                            </Form.Group>
                          </div>
                        </Col>
                      )}
                      <Col xl={3} lg={4} md={6}>
                        <div className="d-flex align-items-center filters-dropdown-btn">
                          <Button className="common-btn px-3 text-nowrap" type="Submit">
                            <span className="me-2">
                              <FontAwesomeIcon icon={faSearch} width={18} height={18} />
                            </span>
                            Search
                          </Button>
                          <Button className="common-outline-btn px-4 ms-2" onClick={handleReset} type="reset">
                            Reset
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom d-flex justify-content-between">
                  <h4 className="common-heading mb-0">View Price Money</h4>
                  <Button className="common-btn p-1 px-2">
                    <FontAwesomeIcon icon={faDownload} onClick={handleDownload} className="text-white" width={15} />
                  </Button>
                </div>
                <Card.Body className="box-padding" ref={tableRef} id="myTable">
                  {!showTableData && <CustomDataTable rows={tableFilter} columns={columns} options={tableOptions} />}
                  {!showTable && (
                    <CustomDataTable rows={filteredData} columns={columnsWithdrawal} options={tableOptionsWithdrawal} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default ViewPriceMoney;
