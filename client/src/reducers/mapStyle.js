import { combineReducers } from 'redux';
import valueReducer from './valueReducer';
import {SET_FLOW_MAX, SET_LOC_MAX} from '../actions/mapAction';

export const mapStyle = combineReducers({
    flowMax: valueReducer(SET_FLOW_MAX, 5),
    locMax: valueReducer(SET_LOC_MAX, 5)
})
