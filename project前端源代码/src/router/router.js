import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'


import Index from '../pages/Index.js'
import Login from '../pages/Login.js'
import Register from '../pages/Register.js'
import NotFoundPage from '../pages/NotFoundPage.js'

import Publish from '../pages/PublishProduct.js'
import PurchaseProduct from '../pages/buyProduct.js'
import Unlist from '../pages/UnlistProduct.js'
import GoodsListWrapper from '../pages/GoodsList.js'
import GoodsInfoWrapper from '../pages/GoodInfo.js'
import SubmitReview from '../pages/submitReview.js'
import Donate from '../pages/donate.js'
import Order from '../pages/order.js'
import DonatedProductsList from '../pages/donateList.js'
export default function MyRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
            
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              
                <Route path="/api" element={<Index />}>
                     <Route path="goodsList" element={<GoodsListWrapper />} />
                    <Route path="goodInfo/:id/:address/:name/:price/:img/:description/:quantity/:category" element={<GoodsInfoWrapper />} />
                    <Route path="buy" element={<PurchaseProduct />} />
                    <Route path="publish" element={<Publish />} />
                    <Route path="unlist" element={<Unlist />} />
                    <Route path="submit" element={<SubmitReview />} />
                    <Route path="donate" element={<Donate />} />
                    <Route path="order" element={<Order />} />

                    <Route path="donateList" element={<DonatedProductsList />} />
                </Route>
                
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}

