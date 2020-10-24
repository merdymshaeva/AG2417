import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, InputGroup } from 'reactstrap';
import cx from 'classnames';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';
import SelectData from '../dashboard/select';

import { changeActiveSidebarItem } from '../../actions/navigation';
import { promiseAction, SET_PARAMS, GET_FLOW } from '../../actions/mapAction';
import { setFlowMax, setLocMax, setTopFlows, setOpacity, setHover } from '../../actions/mapAction';
import { SliderPresentation, InputSlider } from '../../components/dashboard/slider'

import Example from '../../components/Sidebar/ExampleToolb';


export default function Sidebar(props) {
    const [activeItem, flowMax, locMax, hover, topFlows, query] = useSelector(state => ([
        state.navigation.activeItem,
        state.mapStyle.flowMax,
        state.mapStyle.locMax,
        state.mapStyle.hover,
        state.mapStyle.topFlows,
        state.mapQuery
    ]))

    const {minTime, maxTime, minLength, maxLength} = query.params;
    const dispatch = useDispatch();

    const onMinTimeChange = (e) =>{
        dispatch({ type: SET_PARAMS, value: { minTime:  Number(e.target.value)} })
    }

    const onMaxTimeChange = (e) =>{
        dispatch({ type: SET_PARAMS, value: { maxTime:  Math.max(e.target.value, minTime || 1)} })
    }

    const onMinLenChange = (e) => {
        dispatch({ type: SET_PARAMS, value: { minLength:  Number(e.target.value)} })
    }

    const onMaxLenChange = (e) => {
        dispatch({ type: SET_PARAMS, value: { maxLength:  Number(e.target.value)} })
    }

    const onTravelTime = () => {
        dispatch({ type: SET_PARAMS, value: { minTime, maxTime } });
        dispatch(promiseAction({ ...query }, GET_FLOW))
    }


    const onTripLength = () => {
        dispatch({ type: SET_PARAMS, value: { minLength, maxLength } });
        dispatch(promiseAction({ ...query }, GET_FLOW))
    }

    return (
        <div
            className={cx(s.root)}
        >
            <nav>

                <header className={s.logo}>
                    <a href="#" data-toggle="tooltip" title="This is a project made by us">ShareFlow Stockholm</a>
                    <Example />
                </header>


                <ul className={s.nav}>
                    <LinksGroup
                        onActiveSidebarItemChange={activeItem => dispatch(changeActiveSidebarItem(activeItem))}
                        activeItem={activeItem}
                        header="Dashboard-HOME"
                        isHeader
                        iconName="flaticon-home"
                        link="/app/main"
                        index="main"
                    />
                    <h5 className={[s.navTitle, s.groupTitle].join(' ')}><a title="Here you can decide how many of the possible flows you wnat to see">FILTERS</a></h5>

                    {/* <a href="#" data-toggle="tooltip" title="Play around with this as much as you want">ShareFlow Stockholm</a> */}
                    <InputSlider
                        topFlows={topFlows}
                        setTopFlows={v => dispatch(setTopFlows(v))}
                    />
                    <h6 >Travel Time [min]{/* eslint-disable-next-line */} </h6>
                    <InputGroup>
                        {/* <InputGroupAddon addonType="prepend" btn btn-outline-primary mr-2 btn-sm>TT</InputGroupAddon> */}
                        <Input placeholder="Min" min={0} max={maxTime} size="sm" type="number" step="1"
                            onChange={onMinTimeChange}
                        />
                        <Input placeholder="Max" min={minTime || 1} max={100} size="sm" type="number" step="1"
                            onChange={onMaxTimeChange}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-primary mr-2 btn-sm"
                            onClick={onTripLength}
                        >Ok
                        </button>

                        {/* <InputGroupAddon addonType="append">minutes</InputGroupAddon> */}

                    </InputGroup>
                    <h6 >Trip length </h6>
                    <InputGroup>
                        {/* <InputGroupAddon addonType="prepend" size="sm">TL</InputGroupAddon> */}
                        <Input placeholder="Min" min={0} max={100} size="sm" color='' type="number" step="1"
                            onChange={onMinLenChange}
                        />
                        <Input placeholder="Max" min={0} max={100} size="sm" type="number" step="1"
                            onChange={onMaxLenChange}
                        />
                        <button
                            type="button"
                            className="btn btn-outline-primary mr-2 btn-sm"
                            onClick={onTravelTime}
                        >Ok
                        </button>
                        {/* <InputGroupAddon addonType="append">m</InputGroupAddon>  */}
                    </InputGroup>
                    <h5 className={s.navTitle}>
                        <a href="#" data-toggle="tooltip" title="After changing the data you need to zoom to make the changes visible on the map.">DATA</a>
                        <Example />
                        {/* <a >ShareFlow Stockholm</a>  */}

                        {/* <span className="fw-bold">Blue</span></a> */}
                    </h5>
                    <SelectData />
                    <h5 className={s.navTitle}>STYLE</h5>
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
                </ul>
            </nav>
        </div>
    );


}


