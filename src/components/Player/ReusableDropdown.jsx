import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

function ReusableDropdown(props) {
  const { options, selectedValue, onSelect, placeholder, displayKey, valueKey } = props;
  const [searchValue, setSearchValue] = useState('');
  const [selectOptions, setSelectOptions] = useState(false);

  const handleOptionSelect = (option) => {
    onSelect(option);
    setSelectOptions(true);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const filteredOptions = options.filter((option) =>
    option[displayKey].toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    if (selectOptions) {
      setSearchValue('');
    }
  }, [selectOptions]);

  return (
    <Dropdown className="form-control px-0 py-0 filter-box-dropdown card-border">
      <Dropdown.Toggle
        variant="none"
        className="w-100 hight-50 text-start  base-color-3 bg-white py-2 border-0 d-flex align-items-center fs-14"
        id="dropdown-basic"
      >
        <span className="text-truncate pe-3">{selectedValue}</span>
      </Dropdown.Toggle>
      <Dropdown.Menu className="w-100 card-border overflow-auto dropdown-height">
        <div className="px-2 mb-2">
          <input
            type="search"
            placeholder={`Search ${placeholder}`}
            onChange={handleSearchChange}
            className="form-control shadow-none card-border fs-14 hight-50"
            value={searchValue}
          />
        </div>
        {filteredOptions.map((option) => (
          <Dropdown.Item
            key={option[valueKey]}
            className={`py-2 fs-14 base-color ${selectedValue === option[displayKey] ? 'active' : ''}`}
            onClick={() => handleOptionSelect(option)}
          >
            {option[displayKey]}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default ReusableDropdown;
