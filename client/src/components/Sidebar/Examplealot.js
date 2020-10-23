import React, { Component, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_PARAMS } from "../../actions/mapAction";
import Checkbox from './ExampleCheck';

const OPTIONS = {
  transit: 'PT',
  car: 'CAR',
  walk: 'WALK',
  bicycle: 'BIKE'
};

const Applicationen = () => {
  const dispatch = useDispatch();
  const [checkboxes, setCheckboxes] = useState(Object.values(OPTIONS).reduce(
    (options, option) => ({
      ...options,
      [option]: false
    }),
    {}
  ))


  const selectAllCheckboxes = isSelected => {
    Object.keys(checkboxes).forEach(checkbox => {
      setCheckboxes(prevState => ({
        ...prevState,
        [checkbox]: isSelected
      }));
      console.log(checkboxes)
      dispatch({
        type: SET_PARAMS,
        value: {
          modes: Object.keys(OPTIONS)
            .filter(checkbox => checkboxes[OPTIONS[checkbox]])
        }
      })
    });
  };

  const selectAll = () => selectAllCheckboxes(true);

  const deselectAll = () => selectAllCheckboxes(false);

  const handleCheckboxChange = changeEvent => {
    const { name } = changeEvent.target;

    setCheckboxes(prevState => {
      const newState = {
        ...prevState,
        [name]: !prevState[name]
      }
      dispatch({
        type: SET_PARAMS,
        value: {
          modes: Object.keys(OPTIONS)
            .filter(checkbox => newState[OPTIONS[checkbox]])
        }
      })
      console.log(prevState, !prevState[name])
      return newState
    })
  };

  const handleFormSubmit = formSubmitEvent => {
    formSubmitEvent.preventDefault();

    Object.keys(checkboxes)
      .filter(checkbox => checkboxes[checkbox])
      .forEach(checkbox => {
        console.log(checkbox, "is selected.");
      });
  };

  const createCheckbox = option => (
    <Checkbox
      label={option}
      isSelected={checkboxes[option]}
      onCheckboxChange={handleCheckboxChange}
      key={option}
    />
  );

  const createCheckboxes = () => Object.values(OPTIONS).map(createCheckbox);

  return (
    <div className="container">
      <div className="row mt">
        <div className="col-sm-12">
          <form onSubmit={handleFormSubmit}>
            {createCheckboxes()}

            {/* <div className="form-group mt-2">
              <button
                type="button"
                className="btn btn-outline-primary mr-2 btn-sm"
                onClick={selectAll}
              >
                Select All
                </button>
              <button
                type="button"
                className="btn btn-outline-primary mr-2 btn-sm"
                onClick={deselectAll}
              >
                Deselect All
                </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Applicationen;
