import { faExchange, faLongArrowAltDown, faLongArrowAltUp, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Button, Form } from 'react-bootstrap';
import { faFile, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { useRouter } from 'next/router';

const CustomPagination = dynamic(import('./CustomPagination'));

const defaultProps = {
  lengthChange: true,
  info: true,
  lengthMenu: [-1, 10, 20, 50, 100],
  search: true,
  columns: {},
  pagination: true,
  sorting: true,
};

export default function CustomDataTable(props) {
  const router = useRouter();
  const {
    rows,
    columns,
    options,
    handleDelete,
    hadelUpdateStatus,
    showStatusBtn,
    showDeleteFilter,
    selectNull,
    handleCheckKey,
    selectedTournament,
    showCencelAlert,
    setShowCencelAlert,
  } = props;
  const [cols, setCols] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [numData, setNumData] = useState(null);
  const [numFirst, setNumFirst] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [tempFilterData, setTempFilterData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [sortingBy, setSortingBy] = useState('');
  const [sortType, setSortType] = useState('');
  const [allChecked, setAllChecked] = useState(false);
  const [entity, setEntities] = useState(Object.assign({}, defaultProps, options));

  const cellClasses = {
    left: 'text-start',
    center: 'text-center',
    right: 'text-end',
  };

  useEffect(() => {
    if (entity) {
      const { hideColumns } = entity;
      if (hideColumns?.length > 0) {
        if (columns?.length > 0) {
          const tempCols = columns.filter((item) => {
            return hideColumns.indexOf(item.field) === -1;
          });
          setCols(tempCols);
        }
      } else {
        setCols(columns);
      }
      if (entity.defaultSortBy) {
        setSortingBy(entity.defaultSortBy);
        handleSorting(entity.defaultSortBy);
      }
    } else {
      setCols(columns);
      setSortingBy(columns[0]['field']);
      handleSorting(columns[0]['field']);
    }
  }, [entity, selectNull]);

  // useEffect(() => {
  //   if (paginationLimit) {
  //     setCurrentPageSize(10);
  //   }
  // }, [paginationLimit]);

  function handleDeleteAlert() {
    setShowAlert(true);
  }

  function handleCancelbooking() {
    setShowCencelAlert(true);
  }

  useEffect(() => {
    if (searchInput !== '') {
      const filtered = rows.filter((item) => {
        return Object.keys(item).some((key) =>
          item?.[key]?.toString().toLowerCase().includes(searchInput.toLowerCase())
        );
      });

      setFilterData(filtered);
      setTempFilterData(filtered);
    } else {
      setFilterData(rows);
      setTempFilterData(rows);
    }

    if (!entity.pagination) {
      setCurrentData(rows);
    }
  }, [searchInput, rows]);

  function getVariableWithType(a, b) {
    // const numRegx = /^\d+$/;
    let keyA = a;
    let keyB = b;
    if (!isNaN(parseFloat(a))) {
      keyA = eval(parseFloat(a));
      keyB = eval(parseFloat(b));
    } else if (moment(a).isValid()) {
      keyA = moment(a);
      keyB = moment(b);
    }
    return { keyA, keyB };
  }


  function handleSorting(keyName) {
    const sorted = [...filterData];
    if (sortingBy != '' && keyName != sortingBy) {
      setSortType('asc');
      sorted.sort(function (a, b) {
        const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
      setFilterData([...sorted]);
      setAscending(false);
      setSortingBy(keyName);
    } else if (sortType == 'desc') {
      setFilterData([...tempFilterData]);
      setSortType('');
      setSortingBy('');
    } else {
      setSortType((ascending && 'asc') || 'desc');
      if (ascending) {
        sorted.sort(function (a, b) {
          const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
          if (keyA < keyB) {
            return -1;
          }
          if (keyA > keyB) {
            return 1;
          }
          return 0;
        });
        setFilterData([...sorted]);
      } else {
        sorted.sort(function (a, b) {
          const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
          if (keyA > keyB) {
            return -1;
          }
          if (keyA < keyB) {
            return 1;
          }
          return 0;
        });
        setFilterData([...sorted]);
      }
      setAscending(!ascending);
      setSortingBy(keyName);
    }
  }

  const handleSelectAllClick = () => {
    setAllChecked(!allChecked);
    handleCheckKey(allChecked ? [] : rows.map((row) => row.id));
    // const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    // checkboxes.forEach((checkbox) => {
    //   checkbox.checked = false;
    // });
  };

  const handleSelectItems = (event) => {
    const targetValue = event?.target.value;
    handleCheckKey((prevCheckedItems) => {
      if (prevCheckedItems.includes(targetValue)) {
        return prevCheckedItems.filter((item) => item !== targetValue);
      } else {
        return [...prevCheckedItems, targetValue];
      }
    });
  };

  function renderTableColumns() {
    return (
      <thead>
        <tr>
          {cols &&
            cols.map((col, index) => {
              return (
                <th
                  key={index}
                  className={`cursor-pointer user-select-none ${
                    ((col?.field == ['Action'] ||
                      col?.field == ['Status'] ||
                      col?.field == ['View_Match'] ||
                      col?.field == ['Is_vacant'] ||
                      col?.field == ['Select_All']) &&
                      'text-center') ||
                    'text-left'
                  }
                `}
                  onClick={() => handleSorting(col.field)}
                >
                  {col.heading}
                  {(col.field == ['Select_All'] && (
                    <Form.Check
                      className="cursor-pointer shadow-none tabel-select-box pt-0 "
                      id="Create"
                      onChange={handleSelectAllClick}
                      // onChange={selectAllData}
                    />
                  )) || (
                    <>
                      {entity?.sorting && (
                        <button className="ps-1 pe-0 bg-transparent border-0 text-white outline-0 shadow-none ms-auto">
                          {sortingBy == col.field && sortType == 'asc' && (
                            <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1 fs-10" />
                          )}
                          {sortingBy == col.field && sortType == 'desc' && (
                            <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1 fs-10" />
                          )}
                          {sortingBy != col.field && (
                            <>
                              <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1 fs-12" />
                              <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1 fs-10" />
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                </th>
              );
            })}
        </tr>
      </thead>
    );
  }

  function renderTableRows() {
    return currentData.map((row, index) => {
      return (
        <tr key={index}>
          {cols &&
            cols.map((col, index) => {
              const colMethod = eval(entity?.columns?.render?.[col['field']]);

              return (
                <>
                  {(col.field == 'Select_All' && (
                    <td>
                      {(row.is_default == 1 && (
                        <span></span> // <Form.Check
                        //   className="cursor-pointer shadow-none tabel-select-box pt-0 "
                        //   id={row.id}
                        //   value={row.id}
                        //   checked={allChecked || selectedTournament}
                        //   onChange={handleSelectItems}
                        // />
                      )) || (
                        <>
                          {(router.pathname == '/dashboard/book-facilities' && (
                            <>
                              {((!row.status || row.is_present == 'absent' || row.is_present == 'present') && (
                                <span></span>
                              )) || (
                                <Form.Check
                                  className="cursor-pointer shadow-none tabel-select-box pt-0 "
                                  id={row.id}
                                  value={row.id}
                                  checked={allChecked || selectedTournament}
                                  onChange={handleSelectItems}
                                />
                              )}
                            </>
                          )) || (
                            <Form.Check
                              className="cursor-pointer shadow-none tabel-select-box pt-0 "
                              id={row.id}
                              value={row.id}
                              checked={allChecked || selectedTournament}
                              onChange={handleSelectItems}
                            />
                          )}
                        </>
                      )}
                    </td>
                  )) || (
                    <td
                      key={index}
                      className={`
                  ${(col?.align && cellClasses[col.align]) || 'text-left'}
                  `}
                    >
                      <span>{(colMethod && colMethod(row[col['field']], row, col['field'])) || row[col['field']]}</span>
                    </td>
                  )}
                </>
              );
            })}
        </tr>
      );
    });
  }

  function hadelUpdateStatusData() {
    hadelUpdateStatus();
    setAllChecked(false);
  }

  function handleCancelConfirm() {
    hadelUpdateStatus();
    setAllChecked(false);
  }

  function selectBox() {
    return (
      <>
        <div className="form-group input-box me-4 mb-md-0 fs-14 mt-md-0">
          Show{' '}
          <select
            className="border rounded-1 oi-select cursor-pointer label-color-4 custom-select px-2 py-1 mx-1"
            defaultValue={10}
            onChange={(e) => setCurrentPageSize((e.target.value == -1 && rows.length) || e.target.value)}
          >
            {entity?.lengthMenu.map((item, index) => {
              return (
                <option key={index} defaultValue={index == 1} value={item}>
                  {(item == -1 && 'ALL') || item}
                </option>
              );
            })}
          </select>{' '}
          Entries
        </div>
      </>
    );
  }

  return (
    <div className="position-relative custom-datatable">
      {rows.length >= 1 && entity && (
        <div className="d-md-flex align-items-center justify-content-between mb-1">
          {entity?.search && (
            <div className="search-input-box position-relative mb-2">
              {(!searchInput && (
                <FontAwesomeIcon icon={faSearch} className="base-link-color position-absolute search-icon" />
              )) || (
                <FontAwesomeIcon
                  icon={faTimes}
                  className="base-link-color position-absolute search-icon"
                  onClick={() => setSearchInput('')}
                />
              )}
              <Form.Control
                type="text"
                className="form-control fs-14 shadow-none p-1 bg-transparent form-search-input"
                placeholder="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          )}
          <div className="action-buttons d-flex mb-2">
            {(router.pathname == '/dashboard/book-facilities' && (
              <>
                {(selectNull.length == [] && <span className="d-none"></span>) || (
                  <Button
                    className="px-3 py-1 table-btns fs-16 fw-400 rounded-1 me-2 btn-danger"
                    onClick={handleCancelbooking}
                    title="Cancel Booking"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                )}
              </>
            )) || (
              <>
                {(showStatusBtn && (
                  <Button
                    className="px-2 py-1 table-btns fs-16 fw-400 rounded-1 me-2"
                    disabled={selectNull?.length == 0}
                    onClick={hadelUpdateStatusData}
                    title="Change Status"
                  >
                    <FontAwesomeIcon icon={faExchange} />
                  </Button>
                )) ||
                  ''}
              </>
            )}
            {(showDeleteFilter && (
              <>
                {(router.pathname == '/dashboard/book-facilities' && <span className="d-none"></span>) || (
                  <Button
                    variant="danger"
                    onClick={handleDeleteAlert}
                    className="btn-danger px-2 py-1 table-btns fs-16 fw-400 rounded-1"
                    title="Delete"
                    disabled={selectNull?.length == 0}
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </Button>
                )}
              </>
            )) ||
              ''}
            {/* {showAlert && (
              <SweetAlert
                warning
                showCancel
                confirmBtnText="Yes, delete it!"
                confirmBtnBsStyle="danger"
                title="Are you sure?"
                onConfirm={handleDelete}
                onCancel={() => setShowAlert(false)}
                focusCancelBtn
              >
                You will not be able to recover this imaginary file!
              </SweetAlert>
            )}

            {showCencelAlert &&
              ((
                <SweetAlert
                  warning
                  showCancel
                  confirmBtnText="Yes, delete it!"
                  confirmBtnBsStyle="danger"
                  title="Are you sure?"
                  onConfirm={handleCancelConfirm}
                  onCancel={() => setShowCencelAlert(false)}
                  focusCancelBtn
                >
                  You will not be able to recover this imaginary file!
                </SweetAlert>
              ) ||
                '')} */}
          </div>
        </div>
      )}
      <div className="table-responsive overview-table">
        {/* {(isLoaded && <TableLoader />) || ( */}
        <table className="w-100 common-table">
          {cols?.length > 0 && entity && renderTableColumns()}
          <tbody>
            {(currentData?.length > 0 && renderTableRows()) || (
              <tr>
                <td colSpan={cols?.length} className="text-center fs-18 label-red">
                  No record found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* )} */}
      </div>
      <div className="row align-items-center my-3">
        <div className="fs-14 col-md-5 col-12 pt-2 pt-md-0">
          <div className="m-auto w-max-content ms-sm-0">
            {currentData.length > 0 && entity?.info && (
              <>
                {(rows.length > 10 && (
                  <p className="m-0 fw-500 label-color-4">
                    Showing {numFirst} to{' '}
                    <span className="m-0 fw-500 label-color-4">
                      {(numData > currentData.length && numFirst == 1 && currentData.length) || numData}{' '}
                    </span>
                    of {filterData.length} entries
                  </p>
                )) || (
                  <p className="m-0 fw-500 label-color-4">
                    Showing {numFirst} to <span className="m-0 fw-500 label-color-4">{currentData.length}</span> of{' '}
                    {filterData.length} entries
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        {entity?.pagination && (
          <div className="col-md-7 col-12">
            <div className="w-max-content m-auto me-sm-0 d-flex align-items-center justify-content-md-end mt-md-0 mt-3">
              {rows.length >= 1 && <>{entity?.lengthChange && selectBox()}</>}
              <CustomPagination
                className="pagination-bar p-0 d-flex align-items-center"
                data={filterData}
                pageSize={Number(currentPageSize)}
                setCurrentData={setCurrentData}
                setNumData={setNumData}
                setNumFirst={setNumFirst}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
