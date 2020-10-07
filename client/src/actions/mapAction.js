import axios from "axios";
export const SET_FLOW_MAX = 'SET_FLOW_MAX';
export const SET_LOC_MAX = 'SET_LOC_MAX';
export const GET_DATA = 'GET_DATA';
export const PROMISE_FAILURE = 'PROMISE_FAILURE';

export function promiseAction({ locationUrl, flowUrl }, actionType) {
    /* action creator: returns an action but dispatches two more actions on the side -> asynchronous side effect */
    const requestLocs = axios.get(locationUrl);
    const requestFls = axios.get(flowUrl);
    return (dispatch) => {
        axios.all([requestLocs, requestFls])
            .then(axios.spread((locRes, flRes) => {
                dispatch({
                    type: actionType,
                    data: { locations: locRes.data, flows: flRes.data }
                })
            }))
            .catch(error => dispatch({ type: actionType, error: error }));
        return { type: actionType, url: { locationUrl, flowUrl }, data: null };
    }

}

export function setFlowMax(value) {
    return { type: SET_FLOW_MAX, value };
}

export function setLocMax(value) {
    return { type: SET_LOC_MAX, value };
} 
