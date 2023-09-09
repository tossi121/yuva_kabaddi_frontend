import { faLongArrowAltDown, faLongArrowAltUp, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Form } from 'react-bootstrap';

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
function CustomDataTable(props) {
  const { rows, columns, options, showCheckboxes, selectedIds, setSelectedIds } = props;
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
  const [loading, setLoading] = useState(true);
  const [entity, setEntities] = useState(Object.assign({}, defaultProps, options));
  const [selectedRows, setSelectedRows] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  const cellClasses = {
    left: 'text-start',
    center: 'text-center',
    right: 'text-end',
  };

  function handleSelectAll() {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    // Update the selectedRows state for all rows.
    const newSelectedRows = {};
    rows.forEach((_, rowIndex) => {
      newSelectedRows[rowIndex] = newSelectAll;
    });
    setSelectedRows(newSelectedRows);

    // Extract the selected IDs and update the selectedIds state.
    const newSelectedIds = newSelectAll ? rows.map((row) => row.id) : [];
    setSelectedIds(newSelectedIds);
  }

  function handleRowSelection(rowIndex) {
    // Toggle the selected state for the clicked row.
    const updatedSelectedRows = { ...selectedRows };
    updatedSelectedRows[rowIndex] = !updatedSelectedRows[rowIndex];
    setSelectedRows(updatedSelectedRows);

    // Get the IDs of selected rows and update the selectedIds state.
    const updatedSelectedIds = Object.keys(updatedSelectedRows)
      .filter((key) => updatedSelectedRows[key])
      .map((key) => rows[parseInt(key, 10)].id);
    setSelectedIds(updatedSelectedIds);
  }

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
  }, [entity]);

  useEffect(() => {
    if (searchInput !== '') {
      const filtered = rows.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          if (typeof value === 'number') {
            const formattedValue = value.toFixed(2);
            return formattedValue.toString().toLowerCase().includes(searchInput?.replaceAll(',', '').toLowerCase());
          }
          return value?.toString().toLowerCase().includes(searchInput?.replaceAll(',', '').toLowerCase());
        });
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

  function renderTableColumns() {
    return (
      <thead>
        <tr>
          {showCheckboxes && (
            <th className="text-center">
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
          )}
          {cols &&
            cols.map((col, key) => {
              return (
                <th
                  key={key}
                  className={`${(entity?.sorting && 'cursor-pointer') || ''}   
                    ${(col?.align && cellClasses[col.align]) || 'text-left'}
                  `}
                  onClick={() => handleSorting(col.field)}
                >
                  {col.heading}
                  {entity?.sorting && (
                    <button className="ps-1 pe-0 bg-transparent border-0 text-white outline-0 shadow-none ms-auto">
                      {sortingBy == col.field && sortType == 'asc' && (
                        <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1" />
                      )}
                      {sortingBy == col.field && sortType == 'desc' && (
                        <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1" />
                      )}
                      {sortingBy != col.field && (
                        <>
                          <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1" />
                          <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1" />
                        </>
                      )}
                    </button>
                  )}
                </th>
              );
            })}
        </tr>
      </thead>
    );
  }

  function renderTableRows() {
    return (
      <tbody>
        {currentData.map((row, key) => {
          const isSelected = selectedRows[key];
          return (
            <tr key={key}>
              {showCheckboxes && (
                <td className="text-center">
                  <input type="checkbox" checked={isSelected} onChange={() => handleRowSelection(key)} />
                </td>
              )}
              {cols &&
                cols.map((col, index) => {
                  const colMethod = eval(entity?.columns?.render?.[col['field']]);
                  return (
                    <td
                      key={index}
                      className={`
                        ${(col?.align && cellClasses[col.align]) || 'text-left'}
                      `}
                    >
                      {col['field'] == 'net_value' ? (
                        <span className={`${row[col['field']] > 0 ? 'percent-green' : 'percent-red'}`}>
                          {(colMethod && colMethod(row[col['field']], row, col['field'])) || row[col['field']]}
                        </span>
                      ) : (
                        <span>
                          {(colMethod && colMethod(row[col['field']], row, col['field'])) || row[col['field']]}
                        </span>
                      )}
                    </td>
                  );
                })}
            </tr>
          );
        })}
      </tbody>
    );
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
    <div className="position-relative">
      {rows?.length >= 1 && entity && (
        <>
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
        </>
      )}
      <div className="table-responsive overview-table">
        <table className="w-100 nifty-table">
          {cols?.length > 0 && entity && renderTableColumns()}
          {(currentData?.length > 0 && renderTableRows()) || (
            <tbody>
              <tr>
                <td colSpan={cols?.length}>No record found!</td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      <div className="row align-items-center my-3 pagination-box justify-content-between">
        <div className="fs-14 col-md-4 col-12 pt-2 pt-md-0 mb-2 mb-lg-0">
          <div className="m-auto w-max-content ms-md-0">
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
              {rows?.length >= 1 && <>{entity?.lengthChange && selectBox()}</>}
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

export default CustomDataTable;
