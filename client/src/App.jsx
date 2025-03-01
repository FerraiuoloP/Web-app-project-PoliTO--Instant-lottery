import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ErrorBoundary from './components/error/ErrorBoundary';
import { ToastProvider } from './components/context/ToastContext';
import { Route, Routes } from 'react-router-dom';
import PlayLottery from './components/lottery/PlayLottery';
import NavigationBar from './components/NavigationBar';
import LoginScreen from './components/LoginScreen';
import ToastWrapper from './components/toast/ToastWrapper';
import ProtectedRoute, { Allowed } from './components/error/ProtectedRoute';
import { UserProvider } from './components/context/UserContext';
import API from './api/api.mjs';
import Leaderboard from './components/Leaderboard';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: "", points: 0 });
  const [loginChecked, setLoginChecked] = useState(false); //this is used to show nothing while checking the login status if accessing a protected route, 
                                                          //otherwise the user would be redirected to the login page for a fraction of a second (since the initial value of isLoggedIn is false)
  const [notifiedOn, setNotifiedOn] = useState(""); //this is used to show the notification only once the result of the last bet is shown, even if switching between pages multiple time.

 //if the user is logged in, fetch the user data and set the user state, otherwise set the user state to default values and set the login status to false                                                         
  const fetchUserStatus = async () => {
    try {
      const response = await API.getCurrentUser();
      setUser({ name: response.username, points: response.points });
      setIsLoggedIn(true);

    } catch (error) {
      setIsLoggedIn(false);
      setUser({ name: "", points: 0 });
      setNotifiedOn("");

    } finally {
      setLoginChecked(true); 
    }
  }

  //check everytime the app is mounted if the user is logged in (previous session)
  useEffect(() => {
    fetchUserStatus();
  }
    , [])

  return (
    <ErrorBoundary>
      <ToastProvider notifiedOn={notifiedOn} setNotifiedOn={setNotifiedOn}> {/* This provide showToast,toastList,deleteToast,notified and setNotified to the child components to manage notifications*/}
        <UserProvider isLoggedIn={isLoggedIn} user={user} loginChecked={loginChecked} refreshUser={fetchUserStatus} > {/* This provide isLoggedIn, user, refreshPoints (wrap of setUser) and loginChecked
                                                                                                        to the child components while setIsLoggedIn and setUser still need to be passed as props!*/}
          <NavigationBar setIsLoggedIn={setIsLoggedIn} setUser={setUser} setNotifiedOn={setNotifiedOn}/>
          <ToastWrapper />
          <Routes>
            <Route index element={<ProtectedRoute allow={Allowed.LoggedOut}><LoginScreen setIsLoggedIn={setIsLoggedIn} setUser={setUser} /></ProtectedRoute>}></Route>
            <Route path="lottery" element={<ProtectedRoute allow={Allowed.LoggedIn}  ><PlayLottery /></ProtectedRoute>}
            ></Route>
            <Route path="leaderboard" element={<ProtectedRoute allow={Allowed.LoggedIn}  ><Leaderboard/></ProtectedRoute>}></Route>
            <Route path="*" element={<div className='text-center'><h1>Not Found - 404</h1></div>}></Route>
          </Routes>
        </UserProvider>
      </ToastProvider>
    </ErrorBoundary>

  )
}

export default App
