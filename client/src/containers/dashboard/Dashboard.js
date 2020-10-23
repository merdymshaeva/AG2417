import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
} from 'reactstrap';
import PropTypes from 'prop-types';

import Widget from '../../components/Widget/Widget';
import Map from './maps/flowmap';
import s from './Dashboard.module.scss';
import { setFlowMax, setLocMax, setTopFlows, setOpacity, setHover } from '../../actions/mapAction';
import { SliderPresentation, InputSlider } from '../../components/dashboard/slider'

const Dashboard = () => {
  const propTypes = {
    sidebarStatic: PropTypes.bool,
    sidebarOpened: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
    activeItem: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  };
  const [sidebarOpened, flowMax, locMax, hover, topFlows] = useSelector(state => ([
    state.navigation.sidebarOpened,
    state.mapStyle.flowMax,
    state.mapStyle.locMax,
    state.mapStyle.hover,
    state.mapStyle.topFlows,
  ]))

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

  return (
    <div className={s.root} ref={myRef}>
      <h1 className="page-title">Flow Map &nbsp;
      </h1>

      <Row>
        <Col lg={9}>
          <Widget className="bg-transparent mapWidget">
            <Map />
            {/* <iframe width="800" height="600" src="https://flowmap.blue/1uHumN4NeDIm1YFXnYowJWOXc_oGFsKIfSCXhdrGYaHg/embed" frameBorder="0" allowFullScreen></iframe> */}
          </Widget>
        </Col>

        <Col lg={3}>
          <h5 className={[s.navTitle, s.groupTitle].join(' ')}><a title="Here you can decide how many of the possible flows you wnat to see">FILTERS</a></h5>

          {/* <a href="#" data-toggle="tooltip" title="Play around with this as much as you want">ShareFlow Stockholm</a> */}
          <InputSlider
            topFlows={topFlows}
            setTopFlows={v => dispatch(setTopFlows(v))}
          />
          <h5 className={s.navTitle}>
            STYLE
                {/* eslint-disable-next-line */}
            <a className={s.actionLink}>
              <i className={`${s.glyphiconSm} glyphicon glyphicon-plus float-right`} />
            </a>
          </h5>
          {/* eslint-disable */}
          <SliderPresentation
            flowMax={flowMax}
            setMaxFlowMagnitude={(v) => dispatch(setFlowMax(v))}
            locMax={locMax}
            setMaxLocationTotal={v => dispatch(setLocMax(v))}
            // opacity={this.props.opacity}
            setOpacity={v => dispatch(setOpacity(v))}
            hover={hover}
            setHover={v => dispatch(setHover(v))}
          />
          {/* eslint-enable */}
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
