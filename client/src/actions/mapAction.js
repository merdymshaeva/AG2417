import axios from "axios";
export const SET_FLOW_MAX = 'SET_FLOW_MAX';
export const SET_LOC_MAX = 'SET_LOC_MAX';
export const SET_TOP_FLOWS = 'SET_TOP_FLOWS';
export const SET_LON_LAT = 'SET_LON_LAT';
export const SET_OPACITY = 'SET_OPACITY';
export const SET_HOVER = 'SET_HOVER';

export const GET_TYPES = 'GET_TYPES';
export const GET_DATA = 'GET_DATA';
export const PROMISE_FAILURE = 'PROMISE_FAILURE';

export function dataPromiseAction({ locationUrl, flowUrl }, actionType) {
    /* action creator: returns an action but dispatches two more actions on the side -> asynchronous side effect */
    const requestLocs = axios.get(locationUrl);
    const requestFls = axios.get(flowUrl);
    return (dispatch) => {
        axios.all([requestLocs, requestFls])
            .then(axios.spread((locRes, flRes) => {
                dispatch({
                    type: actionType,
                    data: { locations: locRes.data, flows: flRes.data }
                });
            }))
            .catch(error => dispatch({ type: actionType, error: error }));
        return { type: actionType, data: null, error: null };
    }
}

export function typesPromiseAction(typeUrl, actionType) {
    /* action creator: returns an action but dispatches two more actions on the side -> asynchronous side effect */
    return (dispatch) => {
        axios.get(typeUrl)
            .then(res => {
                dispatch({
                    type: actionType,
                    value: res.data
                });
            })
            .catch(error => dispatch({ type: actionType, error: error }));
        return { type: actionType, data: null, error: null };
    }
}

export function setFlowMax(value) {
    return { type: SET_FLOW_MAX, value };
}

export function setLocMax(value) {
    return { type: SET_LOC_MAX, value };
}

export function setLonLat(value) {
    return { type: SET_LON_LAT, value }
}

export function setTopFlows(value) {
    return { type: SET_TOP_FLOWS, value }
}


export function setOpacity(value) {
    return { type: SET_OPACITY, value }
}

export function setHover(value) {
    return { type: SET_HOVER, value }
}