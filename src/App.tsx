import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import type { ReactNode } from 'react'
import { AddItem } from './pages/AddItem'
import { Catalog } from './pages/Catalog'
import { Sidebar } from './components/Sidebar'
import { Transactions } from './pages/Transactions'
import { History } from './pages/History'
import { Analytics } from './pages/Analytics'

const App = (): ReactNode => {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Sidebar />}>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/catalog' element={<Catalog />} />
                    <Route path='/addItem' element={<AddItem />} />
                    <Route path='/transactions' element={<Transactions />} />
                    <Route path='/history' element={<History />} />
                    <Route path='/analytics' element={<Analytics />} />
                </Route>

            </Routes>

        </BrowserRouter>
    )
}

export default App;