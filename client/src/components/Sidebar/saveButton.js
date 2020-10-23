import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Alert } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import { useDispatch } from "react-redux";
import { GET_FLOW, promiseAction } from "../../actions/mapAction";
// import CloseIcon from '@material-ui/icons/Close';

function checkParams(params) {
    let warning;
    Object.keys(params.weightPar).forEach(c => {
        warning = !params.weightPar[c].weight && `You have to set the importance of ${c}!`
            || !params.weightPar[c].par && `You have to select one group of ${c}!`
    })
    return !params.demandType && 'You have to choose demand type!'
        || params.modes.length == 0 && 'You have to choose at least on mode!'
        || Object.keys(params.weightPar).length == 0 && 'No parameters specified!'
        || warning

}

export default function SaveButton() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [warning, setWarning] = useState('')
    const params = useSelector(state => state.mapQuery.params);
    const onSubmit = () => {
        const warn = checkParams(params);
        if (warn) {
            setWarning(warn)
            setOpen(true);
        } else {
            params.s1 = Object.values(params.weightPar).map(v => `${v.weight}*sum("${v.par}")`).join('+');
            params.s2 = Object.values(params.weightPar).map(v => `sum("${v.par}")`).join('+');
            dispatch(promiseAction({url: '/api/get_algorithm_output', params}, GET_FLOW));
        }
    }

    return (
        <div>
            <Collapse in={open}>
                <Alert color="info" isOpen={open} toggle={() => setOpen(false)}>
                    {/* <CloseIcon fontSize="inherit" /> */}
                    {/* </IconButton> */}
                    {warning}
                </Alert>
            </Collapse>
            <button type="submit" className="btn btn-outline-primary mr-2 btn-sm"
                onClick={onSubmit}
            >
                Save
            </button>
        </div>
    )
}


