import React from 'react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch } from 'react-redux';
import { GET_DATA, promiseAction } from '../../actions/mapAction';

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

const locationUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/locations.json';
const flowUrl15 = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2015.json';
const flowUrl16 = "https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-2016.json";
const flowDiffUrl = 'https://raw.githubusercontent.com/teralytics/flowmap.gl/master/examples/public/data/flows-diff-2015-2016.json';

export default function SelectData() {
    const classes = useStyles();
    const dispatch = useDispatch();

    return (
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="grouped-select">OD</InputLabel>
            <Select defaultValue="" id="grouped-select"
                onChange={e => dispatch(promiseAction({ locationUrl, flowUrl: e.target.value }, GET_DATA))}>
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                <ListSubheader>Mode</ListSubheader>
                <MenuItem value={flowUrl15}>AuxTimeOffpeak</MenuItem>
                <MenuItem value={flowUrl16}>AuxTimePeak</MenuItem>
                <ListSubheader>Transit</ListSubheader>
                <MenuItem value={flowDiffUrl}>Diff</MenuItem>
                <MenuItem value={4}>Option 4</MenuItem>
                <ListSubheader>Wait</ListSubheader>
                <MenuItem value={3}>Option 3</MenuItem>
                <MenuItem value={4}>Option 4</MenuItem>
            </Select>
        </FormControl>
    );
}
