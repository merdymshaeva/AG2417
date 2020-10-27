import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, InputGroup } from 'reactstrap';
import cx from 'classnames';
import s from './Sidebar.module.scss';
import LinksGroup from './LinksGroup';
import SelectData from '../dashboard/select';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input1 from '@material-ui/core/Input';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { changeActiveSidebarItem } from '../../actions/navigation';
import { promiseAction, SET_PARAMS, GET_FLOW, SET_URL } from '../../actions/mapAction';
import { setFlowMax, setLocMax, setTopFlows, setOpacity, setHover } from '../../actions/mapAction';
import { SliderPresentation, InputSlider } from '../../components/dashboard/slider'

import Example from '../../components/Sidebar/ExampleToolb';
const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    chip: {
        margin: 2,
        minWidth: 200,
      },
  }));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const municipalities = ['Include All', 'Botkyrka','Danderyd','Ekerö','Haninge',
                       'Huddinge','Järfälla','Lidingö','Nacka','Norrtälje','Nykvarn',
                       'Nynäshamn','Österåker','Salem','Sigtuna','Södertälje','Sollentuna',
                       'Solna','Stockholm','Sundbyberg','Täby','Tyresö','Upplands-Väsby',
                       'Upplands-Bro','Vallentuna','Värmdö','Vaxholm'];

function getStyles(name, municipalityName, theme) {
                   return {
                          fontWeight:
                            municipalities.indexOf(name) === -1
                              ? theme.typography.fontWeightRegular
                              : theme.typography.fontWeightMedium,
                        };
                      }

export default function Sidebar(props) {
    const [activeItem, flowMax, locMax, hover, topFlows, query] = useSelector(state => ([
        state.navigation.activeItem,
        state.mapStyle.flowMax,
        state.mapStyle.locMax,
        state.mapStyle.hover,
        state.mapStyle.topFlows,
        state.mapQuery,
    ]))

    const {minLength, maxLength, name_2} = query.params;
    const [municipalityName, setMunicipalityName] = React.useState([]);
    const dispatch = useDispatch();

    const onMinLenChange = (e) => {
        dispatch({ type: SET_PARAMS, value: { minLength:  Number(e.target.value)} })
    }

    const onMaxLenChange = (e) => {
        dispatch({ type: SET_PARAMS, value: { maxLength:  Number(e.target.value)} })
    }
   
    const onTripLength = () => {
        dispatch({ type: SET_PARAMS, value: { minLength, maxLength, name_2 } });
        dispatch(promiseAction({...query }, GET_FLOW))
    }

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    
    const multipleHandleChange = (event) => {
        setMunicipalityName(preState => {
          const newState = event.target.value/*[...preState, event.target.value]*/
          dispatch({ url:'/api/get_algorithm_output',type: SET_PARAMS, value: {name_2: Object.values(newState).map(v=>`'${v}'`).join(',') }});
          //dispatch({type: SET_URL, value:'/api/get_algorithm_output' })
         // dispatch(promiseAction({...query}, GET_FLOW));
          return newState
        });
      };
      /*
        const handleChange = (event) => {
          dispatch({ type: SET_PARAMS, value: { name_2:  String(event.target.value)} })
            dispatch({ url:'/api/get_algorithm_output',type: SET_PARAMS, value: name_2 });
          //  dispatch(promiseAction({url:'/api/get_algorithm_output'}, GET_FLOW));
          };
        //dispatch({ type: SET_PARAMS, value: {name_2: String(Object.values(municipalityName).map(v=>`'${v.municipalityName}'`).join(''))}});
        */
       
   

    const handleClose = () => {
      setOpen(false);
    };
  
    const handleOpen = () => {
      setOpen(true);
    };
    
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
                    <h6>Area of Interest</h6>
                    {/* here uour shit */}
                    <FormControl className={classes.formControl}>
        <InputLabel id="mutiple-name-label">Municipalities</InputLabel>
        <Select
          labelId="mutiple-name-label"
          id="mutiple-name"
          multiple
          value={municipalityName}
          onChange={multipleHandleChange}
          input={<Input1 />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {municipalities.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, municipalityName, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
{/*}

                   <FormControl className={classes.formControl}>
                    <InputLabel id="demo-controlled-open-select=label">Municipalities</InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      open={open}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      value={name_2}
                      onChange={handleChange}
                   
                      >
                          <MenuItem value="">
                              <em>None</em>
                          </MenuItem>
                          <MenuItem value={'Include All'}>Incude All</MenuItem>
                          <MenuItem value={'Botkyrka'}>Botkyrka</MenuItem>
                          <MenuItem value={'Danderyd'}>Danderyd</MenuItem>
                          <MenuItem value={'Ekerö'}>Ekerö</MenuItem>
                          <MenuItem value={'Haninge'}>Haninge</MenuItem>
                          <MenuItem value={'Huddinge'}>Huddinge</MenuItem>
                          <MenuItem value={'Järfälla'}>Järfälla</MenuItem>
                          <MenuItem value={'Lidingö'}>Lidingö</MenuItem>
                          <MenuItem value={'Nacka'}>Nacka</MenuItem>
                          <MenuItem value={'Norrtälje'}>Norrtälje</MenuItem>
                          <MenuItem value={'Nykvarn'}>Nykvarn</MenuItem>                         
                          <MenuItem value={'Nynäshamn'}>Nynäshamn</MenuItem>
                          <MenuItem value={'Salem'}>Salem</MenuItem>
                          <MenuItem value={'Sigtuna'}>Sigtuna</MenuItem>
                          <MenuItem value={'Södertälje'}>Södertälje</MenuItem>
                          <MenuItem value={'Sollentuna'}>Sollentuna</MenuItem>
                          <MenuItem value={'Solna'}>Solna</MenuItem>
                          <MenuItem value={'Stockholm'}>Stockholm</MenuItem>
                          <MenuItem value={'Sundbyberg'}>Sundbyberg</MenuItem>
                          <MenuItem value={'Täby'}>Täby</MenuItem>
                          <MenuItem value={'Tyresö'}>Tyresö</MenuItem>
                          <MenuItem value={'Upplands-Bro'}>Upplands-Bro</MenuItem>
                          <MenuItem value={'Upplands-Väsby'}>Upplands-Väsby</MenuItem>
                          <MenuItem value={'Vallentuna'}>Värmdö</MenuItem>
                          <MenuItem value={'Värmdö'}>Värmdö</MenuItem>
                          <MenuItem value={'Vaxholm'}>Vaxholm</MenuItem>
                          <MenuItem value={'Österåker'}>Österåker</MenuItem>
                          
                      </Select>
                        
</FormControl> 
          */}
                    {/*uour shit stop*/}
                    
                    <h6 >Trip length [km]</h6>
                    <InputGroup>
                        {/*<InputGroupAddon addonType="prepend" size="sm">TL</InputGroupAddon> */}
                        <Input placeholder="Min" min={0} max={100} size="sm" color='' type="number" step="1"
                            onChange={onMinLenChange}
                        />
                        <Input placeholder="Max" min={0} max={100} size="sm" type="number" step="1"
                            onChange={onMaxLenChange}
                /> 
                        <button
                            type="button"
                            className="btn btn-outline-primary mr-2 btn-sm"
                            onClick={onTripLength}
                        >Filter!
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


