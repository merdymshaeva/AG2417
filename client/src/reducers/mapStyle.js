import { combineReducers } from 'redux';
import valueReducer from './valueReducer';
import { SET_FLOW_MAX, SET_LOC_MAX, SET_TOP_FLOWS, SET_LON_LAT, SET_OPACITY, SET_HOVER } from '../actions/mapAction';

export const mapStyle = combineReducers({
    flowMax: valueReducer(SET_FLOW_MAX, 5),
    locMax: valueReducer(SET_LOC_MAX, 5),
    lonLat: valueReducer(SET_LON_LAT, {longitude: 8.645888, latitude:47.411184}),
    topFlows: valueReducer(SET_TOP_FLOWS, 10000),
    opacity: valueReducer(SET_OPACITY, 0.5),
    hover: valueReducer(SET_HOVER, true)
})
