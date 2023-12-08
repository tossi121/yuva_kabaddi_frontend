import { getPriceMasterList } from '@/_services/services_api';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';

const DashboardBreadcrumb = dynamic(import('../Layouts/DashboardBreadcrumbar'));
const CustomDataTable = dynamic(import('../DataTable/CustomDataTable'));

function PriceMaster() {
  const [priceList, setPriceList] = useState(null);

  const columns = [
    { heading: 'Price Type', field: 'type' },
    { heading: 'Amount', field: 'amount' },
    { heading: 'Role', field: 'roleId' },
    { heading: 'Match Group', field: 'matchGroup' },
    { heading: 'For Starting 7', field: 'forStarting7' },
    { heading: 'For Substitute', field: 'forSubstitute' },
    { heading: 'For Winning Team', field: 'forWinningTeam' },
    { heading: 'For Losing Team', field: 'forLosingTeam' },
    { heading: 'For Tie Team', field: 'forTieTeam' },
  ];

  useEffect(() => {
    handlePriceMaster();
  }, []);

  async function handlePriceMaster() {
    const res = await getPriceMasterList();
    if (res?.status) {
      const data = res.data;
      setPriceList(data);
    }
  }

  const tableOptions = {
    columns: {
      render: {
        roleId: renderRole,
        forStarting7: renderForStarting,
        forSubstitute: renderForSubstitute,
        forWinningTeam: renderWinningTeam,
        forLosingTeam: renderLosingTeam,
        forTieTeam: renderTieTeam,
      },
    },
  };

  function renderRole(value, row) {
    return <span>{(row?.roleId == 1 && 'PLAYER') || 'COACH'} </span>;
  }

  function renderBadge(value, row, conditionKey) {
    const statusColors = {
      Y: 'success',
      N: 'danger',
    };

    const conditionValue = row[conditionKey];

    return (
      <>
        {(conditionValue && (
          <Badge pill bg={statusColors[conditionValue]} className="fs-12">
            {conditionValue === 'Y' ? 'Yes' : 'No'}
          </Badge>
        )) ||
          'N/A'}
      </>
    );
  }

  function renderForStarting(value, row) {
    return renderBadge(value, row, 'forStarting7');
  }

  function renderForSubstitute(value, row) {
    return renderBadge(value, row, 'forSubstitute');
  }

  function renderWinningTeam(value, row) {
    return renderBadge(value, row, 'forWinningTeam');
  }

  function renderLosingTeam(value, row) {
    return renderBadge(value, row, 'forLosingTeam');
  }

  function renderTieTeam(value, row) {
    return renderBadge(value, row, 'forTieTeam');
  }

  return (
    <>
      <section className="dashboard-section">
        <Container fluid>
          <Row className="mt-4">
            <Col lg={12}>
              <div className="d-flex justify-content-between">
                <div className="mb-4">
                  <DashboardBreadcrumb breadcrumbTitle="Price Master" data={'Home'} />
                </div>
                <Link
                  className="common-btn rounded-circle add-filter-btn d-flex align-items-center justify-content-center me-2 p-2"
                  title="Add Price"
                  href="/super-admin/price-master/add"
                >
                  <FontAwesomeIcon icon={faPlus} width={18} height={18} />
                </Link>
              </div>

              <Card className="bg-white common-card-box">
                <div className="card-head card-head-padding border-bottom">
                  <h4 className="common-heading mb-0">Price Master</h4>
                </div>
                <Card.Body className="box-padding">
                  {priceList && <CustomDataTable rows={priceList} options={tableOptions} columns={columns} />}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default PriceMaster;
