import React, { useEffect } from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { GET_TYPES, GET_DATA, dataPromiseAction, typesPromiseAction, setLonLat } from '../../actions/mapAction';
import $ from "jquery";


const useStyles = makeStyles((theme) => ({
    root: {
        color: 'blue',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

// const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
const flowUrl15 = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json';
const flowUrl16 = "https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2016.json";
const flowDiffUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-diff-2015-2016.json';
const locationUrl = process.env.PUBLIC_URL + "/basemma.geojson";
const AuxOffUrl = '/api/get_flows'; //process.env.PUBLIC_URL+ "/AuxTimeOffpeak4.json";

export default function SelectData() {
    const classes = useStyles();
    const dispatch = useDispatch();
    // Create a new jQuery.Event object with specified event properties.
    // var evt = jQuery.Event("mousewheel", { wheelDelta: -100 });
    useEffect(() => {
        dispatch(typesPromiseAction('/api/get_flowtypes', GET_TYPES));
    }, [])

    const flowTypes = useSelector(state => state.mapData.types)

    const onSelect = (e) => {
        dispatch(dataPromiseAction({ locationUrl, flowUrl: '/api/get_flows/' + e.target.value }, GET_DATA));
        dispatch(setLonLat({longitude: 8.645888, latitude:47.411184}))
    }

    return (
        <FormControl className={classes.formControl}>
            {/* <InputLabel htmlFor="grouped-select">OD</InputLabel> */}
            <Select defaultValue="" id="grouped-select"
                onChange={onSelect}>
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {/* <ListSubheader>Mode</ListSubheader> */}
                {flowTypes.map(flowType => <MenuItem value={flowType} key={flowType}>{flowType}</MenuItem>)}
                {/* <MenuItem value={[location1Url, AuxOffUrl]}>AuxTimeOffpeak</MenuItem>
                <MenuItem value={[locationUrl, flowUrl15]}>flow15</MenuItem>
                <MenuItem value={[locationUrl, flowUrl16]}>flow16</MenuItem>
                <ListSubheader>Transit</ListSubheader>
                <MenuItem value={[locationUrl, flowDiffUrl]}>Diff</MenuItem>
                <ListSubheader>Wait</ListSubheader>
                <MenuItem value={3}>Option 3</MenuItem>
                <MenuItem value={4}>Option 4</MenuItem> */}
            </Select>
        </FormControl>
    );
}
