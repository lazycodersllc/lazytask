import notificationTemplate from './notificationTemplateSlice'
import { combineReducers } from 'redux'
const reducer = combineReducers({
    notificationTemplate: notificationTemplate,
})
export default reducer