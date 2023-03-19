
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import{ MainPage, ComicsPage, InfoPage, Page404} from '../pages';
import AppHeader from "../appHeader/AppHeader";


const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Routes>
                        <Route path='/' element={<MainPage/>}/>
                        <Route path='/comics' element={<ComicsPage/>}/>
                        <Route path='/comics/:resourceId' element={<InfoPage/>}/>
                        <Route path='*' element={<Page404/>}/>
                        <Route path='/characters/:resourceId' element={<InfoPage/>}/>
                    </Routes>
                </main>
        </div>
        </Router>
    )
}

export default App;