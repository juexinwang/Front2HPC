import App from '../App'
import Submit from '../pages/Submit'
import Result from '../pages/Result'
import Intro from '../pages/Intro'
import Help from '../pages/Help'
import Contact from '../pages/Contact'
import Example from '../pages/Example'
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'
import Check from '../pages/Check'
import NotFound from '../pages/NotFound'

const BaseRouter=()=>(
    <Router>
        <Routes>
                <Route element={<App/>}>
                    <Route path='/' element={<Intro/>}></Route>
                    <Route path='/intro' element={<Intro/>}></Route>
                    <Route path='/submit' element={<Submit/>}></Route>
                    <Route path='/result' element={<Check/>}></Route>
                    <Route path='/result/:id' element={<Result/>}></Route>
                    <Route path='/help' element={<Help/>}></Route>
                    <Route path='/contact' element={<Contact/>}></Route>
                    <Route path='/example' element={<Example/>}></Route>   
                </Route>
                <Route path='*' element={<NotFound />}></Route>
        </Routes>
    </Router>
)
export default BaseRouter
