import { GET_TYPES, GET_LOC, GET_FLOW, PROMISE_FAILURE } from '../actions/mapAction';
/*
function normalize(flows) {
    const weights = flows.map(fl => fl.count)
    const min = Math.min(...weights)
    const max = Math.max(...weights)
    return flows.map(fl => ({...fl, count: (fl.count- min)/ (max - min+0.00000000001)}))
}
*/
const initialState = {
    types: [],
    data: {
        locations: null,
        flows: null
    },
    error: null,
}

export default function mapData(state = initialState, action) {
    switch (action.type) {
        case GET_TYPES:
            return {
                ...state,
                types: action.value
            }
        case GET_LOC:
            return {
                ...state,
                data: { ...state.data, locations: action.value }
            }
        case GET_FLOW:
            return {
                ...state,
                data: { ...state.data, flows: action.value }
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
