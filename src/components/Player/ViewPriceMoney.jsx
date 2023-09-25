import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import dynamic from 'next/dynamic';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { getPriceMoney, getWithdrawnRequests } from '@/_services/services_api';

const UserEarnings = dynamic(import('./UserEarnings'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));
const WithdrawalModal = dynamic(import('./WithdrawalModal'));
const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));

function ViewPriceMoney() {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [earningsData, setEarningsData] = useState([]);
  const [withdrawalsData, setWithdrawalsData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [filterData, setFilterData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [checkedFilter, setCheckedFilter] = useState(false);
  const tableRef = useRef(null);
  const router = useRouter();
  const { label } = router.query;
  const [selectedFilters, setSelectedFilters] = useState({
    paid: true,
    pending: true,
    reject: true,
  });

  const columnsWithdrawal = [
    { heading: 'Withdrawal Date', field: 'createdAt' },
    { heading: 'Withdrawal Amount', field: 'amount' },
    { heading: 'TDS Amount', field: 'tds_amount' },
    { heading: 'Status', field: 'status' },
    { heading: 'Comment', field: 'comment' },
  ];

  const columns = [
    { heading: 'Pricing Category', field: 'priceType' },
    { heading: 'Match Number', field: 'match_no' },
    { heading: 'Winning Date', field: 'Date' },
    { heading: 'Amount', field: 'priceAmount' },
  ];

  const setSelectedFiltersByLabel = (newLabel) => {
    const updatedFilters = {
      paid: newLabel === 'Paid Withdrawals',
      pending: newLabel === 'Pending Withdrawals',
      reject: newLabel === 'Rejected Withdrawals',
    };

    setSelectedFilters(updatedFilters);
  };

  useEffect(() => {
    if (!showTable || showTable) {
      setStartDate(null);
      setEndDate(null);
      setSelectedFilters({
        paid: true,
        pending: true,
        reject: true,
      });
      setCheckedFilter(false);
    }
  }, [showTable]);

  useEffect(() => {
    handlePriceMoney();
    handleWithdrawnRequests();
    setFilteredData(earningsData);
  }, [JSON.stringify(earningsData)]);

  async function handlePriceMoney() {
    const res = await getPriceMoney();
    if (res?.status) {
      const data = res.data;
      setEarningsData(data);
    }
  }

  async function handleWithdrawnRequests() {
    const res = await getWithdrawnRequests();
    if (res?.status) {
      const data = res.data;
      setWithdrawalsData(data);
    }
  }

  useEffect(() => {
    if (withdrawalsData && label != undefined) {
      setSelectedFiltersByLabel(label);
      if (label === 'Paid Withdrawals') {
        setShowTable(false);
        setFilterData(withdrawalsData.filter((item) => item.status === 'Paid'));
      } else if (label === 'Pending Withdrawals') {
        setShowTable(false);
        setFilterData(withdrawalsData.filter((item) => item.status === 'Pending'));
      } else if (label === 'Rejected Withdrawals') {
        setShowTable(false);
        setFilterData(withdrawalsData.filter((item) => item.status === 'Reject'));
      } else if (label === 'Total Withdrawals') {
        setFilterData(withdrawalsData);
        setShowTable(false);
      }
    }
    if (label === undefined) {
      setShowTable(true);
      setFilterData(withdrawalsData);
    }
  }, [label, withdrawalsData]);

  const tableOptions = {
    columns: {
      render: {
        Date: renderMatchDate,
      },
    },
  };

  const tableOptionsWithdrawal = {
    columns: {
      render: {
        createdAt: renderWithdrawalDate,
        status: renderSatus,
        comment: renderComment,
      },
    },
  };

  function renderWithdrawalDate(value, row) {
    return <span>{moment(row.createdAt).format('DD-MMMM-YYYY')} </span>;
  }

  function renderMatchDate(value, row) {
    return <span>{moment(row.Date).format('DD-MMMM-YYYY')} </span>;
  }

  function renderComment(value, row) {
    return <>{row.comment == null || (row.comment == '' && 'N/A') || row.comment} </>;
  }

  function renderSatus(value, row) {
    const statusColors = {
      Approved: 'success',
      Rejected: 'danger',
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
    if (label === 'Paid Withdrawals' && filterName !== 'paid') {
      return;
    }
    if (label === 'Pending Withdrawals' && filterName !== 'pending') {
      return;
    }
    if (label === 'Rejected Withdrawals' && filterName !== 'reject') {
      return;
    }

    const isFilterSelected = selectedFilters[filterName];
    const numberOfSelectedFilters = Object.values(selectedFilters).filter(Boolean).length;

    if (numberOfSelectedFilters === 1 && isFilterSelected) {
      return;
    }

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !isFilterSelected,
    }));

    setCheckedFilter(true);
  };

  const toggleFilterBox = () => {
    setExpanded(!expanded);
  };

  // Handle reset form
  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setFilteredData(earningsData);
    setFilterData(withdrawalsData);
    setCheckedFilter(false);
    setSelectedFilters({
      paid: true,
      pending: true,
      reject: true,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const adjustedEndDate = endDate ? moment(endDate).add(1, 'day') : null;

    const filteredEarnings = earningsData.filter((item) => {
      const isWithinDateRange =
        (!startDate || moment(item.Date).isSameOrAfter(startDate)) &&
        (!adjustedEndDate || moment(item.Date).isSameOrBefore(adjustedEndDate));

      return isWithinDateRange;
    });

    const filteredWithdrawals = withdrawalsData.filter((item) => {
      const isWithinDateRange =
        (!startDate || moment(item.createdAt).isSameOrAfter(startDate)) &&
        (!adjustedEndDate || moment(item.createdAt).isSameOrBefore(adjustedEndDate));

      const isSelectedStatus =
        (selectedFilters.paid && item.status === 'Paid') ||
        (selectedFilters.pending && item.status === 'Pending') ||
        (selectedFilters.reject && item.status === 'Reject');

      return isWithinDateRange && isSelectedStatus;
    });

    setFilteredData(filteredEarnings);
    setFilterData(filteredWithdrawals);
    setCheckedFilter(false);
  };

  const handleChangeStartDate = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  return (
    <>
      <WithdrawalModal
        {...{
          show,
          setShow,
          handleWithdrawnRequests,
        }}
      />
      <section className="dashboard-section">
        <Container fluid>
          <Row className="mt-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between">
                <div className="mb-4">
                  <DashboardBreadcrumb data={'Dashboard'} />
                </div>
                <Button
                  className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2"
                  onClick={toggleFilterBox}
                >
                  <FontAwesomeIcon icon={faFilter} width={20} height={20} />
                </Button>
              </div>

              <Card
                className={`bg-white rounded-4 filter-wrapper card-border ${expanded ? 'expand-box-commen mb-4 ' : ''}`}
              >
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Price Money Filter</h4>
                </div>

                <Card.Body className="box-padding">
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col xl={3} lg={4} md={6}>
                        <Form.Label className="fs-16 fw-400 base-color">Select Start Date</Form.Label>
                        <div className="mb-2 d-flex flex-column">
                          <ReactDatePicker
                            peekNextMonth
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            selected={startDate}
                            maxDate={new Date()}
                            onChange={handleChangeStartDate}
                            placeholderText="Select Start Date"
                            showTimeSelect={false}
                            dateFormat="dd-MMM-yyyy"
                            className="shadow-none fs-14 fw-400 base-color-2 comon-form-input py-2 px-2 px-md-3"
                          />
                        </div>
                      </Col>
                      <Col xl={3} lg={4} md={6}>
                        <div className="mb-2">
                          <Form.Group className="d-flex flex-column">
                            <Form.Label className="fs-16 fw-400 base-color">Select End Date</Form.Label>
                            <ReactDatePicker
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              placeholderText="Select End Date"
                              showTimeSelect={false}
                              minDate={startDate}
                              maxDate={new Date()}
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
                              <Form.Label className="fs-14 fw-500 base-color-1"> Filter Status</Form.Label>
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
                          <Button
                            className="common-btn px-3 text-nowrap"
                            type="Submit"
                            disabled={!startDate && !endDate && !checkedFilter}
                          >
                            <span className="me-2">
                              <FontAwesomeIcon icon={faSearch} width={18} height={18} />
                            </span>
                            Search
                          </Button>
                          <Button
                            className="common-outline-btn px-4 ms-2"
                            onClick={handleReset}
                            type="reset"
                            disabled={!startDate && !endDate && !checkedFilter}
                          >
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

          <UserEarnings setShow={setShow} withdrawalShow={1} />

          <Row>
            <Col>
              <div className="d-flex align-items-center my-4">
                <Button
                  className={`rounded-2 me-3 ${(showTable && 'common-btn') || 'common-outline-btn'}`}
                  onClick={() => {
                    if (label === undefined) {
                      setShowTable(true);
                    }
                  }}
                >
                  Earnings
                </Button>
                <Button
                  className={`rounded-2 ${(!showTable && 'common-btn') || 'common-outline-btn'}`}
                  onClick={() => {
                    setShowTable(false);
                  }}
                >
                  Withdrawals
                </Button>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom d-flex justify-content-between">
                  <h4 className="common-heading mb-0">View Price Money</h4>
                  <Button className="common-btn p-1 px-2" onClick={handleDownload}>
                    <FontAwesomeIcon icon={faDownload} className="text-white" width={15} />
                  </Button>
                </div>
                <Card.Body className="box-padding" ref={tableRef} id="myTable">
                  {earningsData.length > 0 && showTable && (
                    <CustomDataTable rows={filteredData} columns={columns} options={tableOptions} />
                  )}

                  {!showTable && (
                    <CustomDataTable rows={filterData} columns={columnsWithdrawal} options={tableOptionsWithdrawal} />
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
