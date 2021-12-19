import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom'
import router from './router/index'

function Home () {
  return (
    <>
      Home
    </>
  )
}

function App() {
  return (
        <Routes>
        {
          router.map(item => {
            return <Route path={item.path} element={
              <Suspense fallback={() => 'loading...'}>
                <item.component />
              </Suspense>
          } key={item.path} />
          })
        }
      </Routes>
    
  );
}

export default App;
