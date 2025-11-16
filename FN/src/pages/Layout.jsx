import { Outlet } from "react-router-dom";
import { useState } from 'react';
import Aside from './Layout/Aside'
import Header from './Layout/Header'
import Footer from './Layout/Footer'

const Layout = ({children}) => {
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatRooms, setChatRooms] = useState({}); 

  const chatProps = {
    activeChatId,
    setActiveChatId,
    chatRooms,
    setChatRooms,
  };

  return (
    <div className="layout">
      <Aside {...chatProps} />
      <Header/>
      <main className='main'>
        <Outlet context={chatProps} /> 
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default Layout