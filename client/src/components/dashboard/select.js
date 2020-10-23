import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useDispatch, useSelector } from 'react-redux';
import { GET_TYPES, promiseAction, setLonLat, GET_FLOW } from '../../actions/mapAction';


const useStyles = makeStyles((theme) => ({
    root: {
        color: 'green',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));


export default function SelectData() {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(promiseAction({ url: '/api/get_flowtypes' }, GET_TYPES));
    }, [])

    const [flowTypes, query] = useSelector(state => ([
        state.mapData.types,
        state.mapQuery
    ]))

    const onSelect = (e) => {
        dispatch(promiseAction({ ...query, url: '/api/get_flows/' + e.target.value }, GET_FLOW));
        dispatch(setLonLat({ longitude: 8.645888, latitude: 47.411184 })) // TODO: not working
    }

    return (
        <FormControl className={classes.formControl}>
            <Select defaultValue="AuxTimePeakT" id="grouped-select"
                onChange={onSelect}>
                {flowTypes.map(flowType => <MenuItem value={flowType} key={flowType}>{flowType}</MenuItem>)}
            </Select>
        </FormControl>
    );
}
