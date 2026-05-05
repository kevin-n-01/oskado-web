import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import type { ReactNode } from 'react'
import { AddItem } from './pages/AddItem'
import { Catalog } from './pages/Catalog'
import { AppLayout } from './components/AppLayout'
import { Transactions } from './pages/Transactions'
import { History } from './pages/History'
import { Analytics } from './pages/Analytics'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InventoryItem } from './pages/InventoryItem'
import { Toaster } from './components/ui/sonner'
import Login from './pages/Login'
import ProtectedLayout from './components/ProtectedLayout'

const App = (): ReactNode => {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route element={<AppLayout />}>
                        <Route element={<ProtectedLayout />}>
                            <Route path='/dashboard' element={<Dashboard />} />
                            <Route path='/catalog' element={<Catalog />} />
                            <Route path='/catalog/:sku' element={<InventoryItem />} />
                            <Route path='/addItem' element={<AddItem />} />
                            <Route path='/transactions' element={<Transactions />} />
                            <Route path='/history' element={<History />} />
                            <Route path='/analytics' element={<Analytics />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>

    )
}

export default App;