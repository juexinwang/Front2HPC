import App from '../App'
import Submit from '../pages/Submit'
import Result from '../pages/Result'
import Intro from '../pages/Intro'
import Help from '../pages/Help'
import Contact from '../pages/Contact'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Check from '../pages/Check'

const BaseRouter=()=>(
    <Router>
        <Routes>
                <Route element={<App/>}>
                    <Route path='/' element={<Intro/>}></Route>
                    <Route path='/intro' element={<Intro/>}></Route>
                    <Route path='/submit' element={<Submit/>}></Route>
                    {/* <Route path='/check' element={<Check/>}></Route> */}
                    <Route path='/result' element={<Check/>}></Route>
                    <Route path='/result/:id' element={<Result/>}></Route>
                    <Route path='/help' element={<Help/>}></Route>
                    
                    <Route path='/contact' element={<Contact/>}></Route>
                </Route>
        </Routes>
    </Router>
)
export default BaseRouter
