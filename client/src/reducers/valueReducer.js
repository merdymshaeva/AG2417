export default function valueReducer(actionType, initialValue = null) {
    return function (state = initialValue, action) {
        if (action.type === actionType) {
            return action.value
        } else {
            return state
        }
    }
}