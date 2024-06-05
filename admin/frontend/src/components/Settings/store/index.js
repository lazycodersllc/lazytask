import company from './companySlice'
import project from './projectSlice'
import task from './taskSlice'
import tag from './tagSlice'
import myTask from './myTaskSlice'
import quickTask from './quickTaskSlice'
import { combineReducers } from 'redux'
const reducer = combineReducers({
    company: company,
    project: project,
    task: task,
    myTask: myTask,
    tag: tag,
    quickTask: quickTask
})
export default reducer
