import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { FormGroup, CustomInput, Input, InputGroup } from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import cx from 'classnames';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';
import SelectData from '../dashboard/select';

import { changeActiveSidebarItem } from '../../actions/navigation';
import { promiseAction, SET_PARAMS, GET_FLOW } from '../../actions/mapAction';

import Example from '../../components/Sidebar/ExampleToolb';
import Applicationen from '../../components/Sidebar/Examplealot';
import WeightSelector from './weightSelector';
import StatsRadios from './dataTypeRadios';
import DemandTypeRadios from './demandTypeRadios';
import SaveButton from './saveButton';

const Sidebar = (props) => {
    const activeItem = useSelector(state => state.navigation.activeItem)

    const dispatch = useDispatch();
    const [minTime, setMinTime] = useState();
    const [maxTime, setMaxTime] = useState();
    const query = useSelector(state => state.mapQuery)
    const onTravelTime = () => {
        dispatch({ type: SET_PARAMS, value: { minTime, maxTime } });
        dispatch(promiseAction({ ...query }, GET_FLOW))
    }
    const [dataType, setDataType] = useState()
    const onDataTypeChange = (event) => {
        setDataType(event.target.value)
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
                        <h6 >Travel Time [min]{/* eslint-disable-next-line */} </h6>
                        <InputGroup>
                            {/* <InputGroupAddon addonType="prepend" btn btn-outline-primary mr-2 btn-sm>TT</InputGroupAddon> */}
                            <Input placeholder="Min" min={0} max={maxTime} size="sm" type="number" step="1"
                                onChange={(e) => setMinTime(Number(e.target.value))}
                            />
                            <Input placeholder="Max" min={minTime || 1} max={100} size="sm" type="number" step="1"
                                onChange={e => setMaxTime(Math.max(e.target.value, minTime || 1))}
                            />
                            <div className="form-group mt-2">
                                <button
                                    type="button"
                                    className="btn btn-outline-primary mr-2 btn-sm"
                                    onClick={onTravelTime}
                                >
                                    Ok
                                </button>
                            </div>
                            {/* <InputGroupAddon addonType="append">minutes</InputGroupAddon> */}

                        </InputGroup>
                        <h6 >Trip length </h6>
                        <InputGroup>
                            {/* <InputGroupAddon addonType="prepend" size="sm">TL</InputGroupAddon> */}
                            <Input placeholder="Min" min={0} max={100} size="sm" color='' type="number" step="1" />
                            <Input placeholder="Max" min={0} max={100} size="sm" type="number" step="1" />
                            {/* <InputGroupAddon addonType="append">m</InputGroupAddon>  */}
                        </InputGroup>
                        <h5 className={s.navTitle}>
                            <a href="#" data-toggle="tooltip" title="After changing the data you need to zoom to make the changes visible on the map.">DATA</a>
                            <Example />
                            {/* <a >ShareFlow Stockholm</a>  */}

                            {/* <span className="fw-bold">Blue</span></a> */}
                        </h5>
                        <SelectData />
                    </Widget>
                </ul>
            </nav>
        </div>
    );
}


export default Sidebar;