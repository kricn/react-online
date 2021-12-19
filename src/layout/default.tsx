import React from 'react';
import { Route, Routes,  } from 'react-router-dom'

function Index () {
  return (
    <>
      index
    </>
  )
}

function Layout () {
  return (
    <div className='default-layout'>
      header
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  )
}

export default Layout