import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
} from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import Map from './maps/flowmap';
import s from './Dashboard.module.scss';
import Applicationen from '../../components/Sidebar/Examplealot';
import WeightSelector from '../../components/Sidebar/weightSelector';
import StatsRadios from '../../components/Sidebar/dataTypeRadios';
import DemandTypeRadios from '../../components/Sidebar/demandTypeRadios';
import SaveButton from '../../components/Sidebar/saveButton';

export default function Dashboard() {
  const propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };
  const sidebarOpened = useSelector(state => state.navigation.sidebarOpened)

  const dispatch = useDispatch();
  const myRef = React.createRef()
  useEffect(() => {
    myRef.current.addEventListener('transitionend', () => {
      if (sidebarOpened) {
        myRef.current.classList.add(s.sidebarOpen);
      }
    }, false);
  }, [propTypes])

  const prevSidebarOpened = useRef();
  useEffect(() => {
    prevSidebarOpened.current = sidebarOpened;
    if (prevSidebarOpened !== sidebarOpened) {
      if (prevSidebarOpened) {
        myRef.current.style.height = `${myRef.current.scrollHeight}px`;
      } else {
        myRef.current.classList.remove(s.sidebarOpen);
        setTimeout(() => {
          myRef.current.style.height = '';
        }, 0);
      }
    }
  });
  const [dataType, setDataType] = useState()
  const onDataTypeChange = (event) => {
      setDataType(event.target.value)
  }

  return (
    <div className={s.root} ref={myRef}>
      <Row>
        <Col lg={9}>
          <Widget className="bg-transparent mapWidget">
            <Map />
            {/* <iframe width="800" height="600" src="https://flowmap.blue/1uHumN4NeDIm1YFXnYowJWOXc_oGFsKIfSCXhdrGYaHg/embed" frameBorder="0" allowFullScreen></iframe> */}
          </Widget>
        </Col>

        <Col lg={3}>
          <Widget
            className="bg-transparent"
            title={<h5> Values Weight</h5>}
          >
            <FormGroup>
              <StatsRadios onDataTypeChange={onDataTypeChange} />
            </FormGroup>
            <WeightSelector dataType={dataType} />
            <FormGroup>
              <h5 >Mode Choices {/* eslint-disable-next-line */} </h5>
              <Applicationen />
            </FormGroup>
            <FormGroup>
              <label className="exampleCheckbox">DEMAND TYPE</label>
              <DemandTypeRadios />
              <SaveButton />
            </FormGroup>
          </Widget>
          {/* eslint-enable */}
        </Col>
      </Row>
    </div>
  );
}


