import { GET_TYPES, GET_DATA, PROMISE_FAILURE } from '../actions/mapAction';
const initialState = {
    types: [],
    data: {
        locations: null,
        flows: null
    },
    error: null,
}

export default function mapData (state = initialState, action) {
    switch (action.type) {
        case GET_TYPES:
            return {
                ...state,
                types: action.value
            }
        case GET_DATA:
            return {
                ...state,
                data: action.data
            }
        case PROMISE_FAILURE:
            return {
                ...state,
                error: action.error
            }
        default: 
            return state
    }
}