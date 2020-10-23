import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import { CustomInput, Input, InputGroup } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { GET_TYPES, promiseAction, setLonLat, GET_FLOW, SET_PARAMS } from '../../actions/mapAction';
import { type } from 'jquery';


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


export default function WeightSelector({ dataType }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(promiseAction({ url: '/api/get_flowtypes' }, GET_TYPES));
    }, [])

    const [flowTypes, weightPar] = useSelector(state => ([
        state.mapData.types,
        state.mapQuery.params.weightPar
    ]))


    var weightGroups = [
        {
            name: 'AGE',
            type: 'stats',
            value: [
                { name: 'O-9', value: 'Er_0_9' },
                { name: '10-29', value: 'Er_10_19' },
                { name: '20-39', value: 'Er_20_39' },
                { name: '40-59', value: 'Er_40_59' },
                { name: '60+', value: 'Er_60_' },
            ],
            default: 'Er_0_9'
        },
        {
            name: 'INCOME',
            type: 'stats',
            value: [
                { name: '0-149', value: 'PI_0_149' },
                { name: '150-399', value: 'PI_150_399' },
                { name: '400+', value: 'PI_400_' },
            ],
            default: 'PI_0_149'
        },
        {
            name: 'HOUSING',
            type: 'stats',
            value: [
                { name: 'Single-family', value: 'Smehus' },
                { name: 'Multi-family', value: 'Flerbostad' },
                { name: 'Others', value: 'Ovriga2' },
            ],
            default: 'Smehus'
        },
        {
            name: 'OCCUPATION',
            type: 'stats',
            value: [
                { name: 'Agriculture, forestry, fishing', value: 'Jordbruk' },
                { name: 'Manufacturing and mining', value: 'Tillverk' },
                { name: 'Energy, water, waste', value: 'Energi' },
                { name: 'Construction', value: 'Bygg' },
                { name: 'Commerce and communications', value: 'Handel' },
                { name: 'Financial and business services', value: 'Finans' },
                { name: 'Education and Research', value: 'Utbildning' },
                { name: 'Health and social care', value: 'Verd' },
                { name: 'Personal and cultural services', value: 'Kultur' },
                { name: 'Public administration, etc.', value: 'Offentlig' },
                { name: 'No information', value: 'Naringsgre' },
            ],
            default: 'Jordbruk'
        },
        {
            name: 'CAR_TYPE',
            type: 'stats',
            value: [
                { name: 'Cabriolet', value: 'Cabriolet' },
                { name: 'Coupé', value: 'Coupe' },
                { name: 'Pick up', value: 'Pick_up' },
                { name: 'Sedan', value: 'Sedan' },
                { name: 'Semi Sedan', value: 'Semi_Sedan' },
                { name: 'Station Wagon', value: 'Station_Wa' },
                { name: 'Towing Truck', value: 'Towing_Tru' },
                { name: 'Van', value: 'Van' },
                { name: 'Others', value: 'Ovriga3' },
            ],
            default: 'Cabriolet'
        },
        {
            name: 'GROUP',
            type: 'mosaic',
            value: [
                { name: 'Mosaic Group A Day population', value: 'A_Day' },
                { name: 'Mosaic Group B Day population', value: 'B_Day' },
                { name: 'Mosaic Group C Day population', value: 'C_Day' },
                { name: 'Mosaic Group D Day population', value: 'D_Day' },
                { name: 'Mosaic Group F Day population', value: 'E_Day' },
                { name: 'Mosaic Group E Day population', value: 'F_Day' },
                { name: 'Mosaic Group G Day population', value: 'G_Day' },
                { name: 'Mosaic Group H Day population', value: 'H_Day' },
                { name: 'Mosaic Group I Day population', value: 'I_Day' },
                { name: 'Mosaic Group J Day population', value: 'J_Day' },
                { name: 'Mosaic Group K Day population', value: 'K_Day' },
                { name: 'Mosaic Group L Day population', value: 'L_Day' },
                { name: 'Others Day population', value: 'Z_Day' },
                { name: 'Mosaic Group A Night population', value: 'A_Night' },
                { name: 'Mosaic Group B Night population', value: 'B_Night' },
                { name: 'Mosaic Group C Night population', value: 'C_Night' },
                { name: 'Mosaic Group D Night population', value: 'D_Night' },
                { name: 'Mosaic Group F Night population', value: 'E_Night' },
                { name: 'Mosaic Group E Night population', value: 'F_Night' },
                { name: 'Mosaic Group G Night population', value: 'G_Night' },
                { name: 'Mosaic Group H Night population', value: 'H_Night' },
                { name: 'Mosaic Group I Night population', value: 'I_Night' },
                { name: 'Mosaic Group J Night population', value: 'J_Night' },
                { name: 'Mosaic Group K Night population', value: 'K_Night' },
                { name: 'Mosaic Group L Night population', value: 'L_Night' },
                { name: 'Others Night population', value: 'Z_Night' },],
            default: 'A_Day'
        }
    ];
    weightGroups = weightGroups.filter(g => !dataType || g.type == dataType)
    const onInput = (value, group) => {
        if (value >= 0 && value <= 1) {
            weightPar[group] = { ...weightPar[group], weight: value }
            dispatch({ type: SET_PARAMS, value: { weightPar } })
            setHelperText(' ');
            setError(false);
            console.log(weightPar)
        }
        else {
            setHelperText('Weight must between 0~1!');
            setError(true);
        }
    };
    const onSelect = (value, group) => {
        weightPar[group] = { ...weightPar[group], par: value }
        dispatch({ type: SET_PARAMS, value: { weightPar } })
        console.log(weightPar)
    }

    const [helperText, setHelperText] = useState('');
    const [error, setError] = useState(false);

    return (
        <div id="weight-values">
            <FormControl component="fieldset" error={error}>
                {weightGroups.map(group => (
                    <InputGroup>
                        <label className="exampleCheckbox">{group.name}</label>
                        <Input placeholder="" min={0} max={1} size="sm" type="number" step="0.1"
                            onChange={(e) => onInput(e.target.value, group.name)}
                        />
                        <Select defaultValue="" id="grouped-select" onChange={e => onSelect(e.target.value, group.name)}>
                            {group.value.map(item => <MenuItem value={item.value} key={item.value}>{item.name}</MenuItem>)}
                        </Select>
                    </InputGroup>
                )
                )}
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </div>
    );
}
