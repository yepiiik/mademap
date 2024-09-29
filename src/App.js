import React, {useEffect, useState} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

// import NotActive from './components/500/NotActive';

import { AuthProvider } from './components/authentication/Auth';
import ProtectedRoute from "./components/authentication/ProtectedRoute";

import EditorView from "./views/EditorView";
import AuthView from './views/AuthView';
import ProfileView from './views/ProfileView'
import Darkmode from './components/Darkmode';

import { isDarkThemePrefered } from './config/base';

const App = () => {
  document.querySelector('body').setAttribute('theme', isDarkThemePrefered ? 'dark' : 'light')

  return (
    // <div className='App'>
    //   <NotActive />
    // </div>
    <AuthProvider>
      <BrowserRouter>
        <div className="App"> 
          <Darkmode />
          <Routes>                                                                        
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <EditorView />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<AuthView/>}/>
            <Route path="/signup" element={<AuthView/>}/>
            <Route path=":username" element={<ProfileView />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
