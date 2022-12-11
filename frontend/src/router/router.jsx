import App from '../App'
import Submit from '../pages/Submit'
import Result from '../pages/Result'
import Intro from '../pages/Intro'
import Help from '../pages/Help'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'

const BaseRouter=()=>(
    <Router>
        <Routes>
                <Route element={<App/>}>
                    <Route path='/' element={<Intro/>}></Route>
                    <Route path='/intro' element={<Intro/>}></Route>
                    <Route path='/submit' element={<Submit/>}></Route>
                    <Route path='/result' element={<Result/>}></Route>
                    <Route path='/help' element={<Help/>}></Route>
                </Route>
        </Routes>
    </Router>
)
export default BaseRouter
