
import MyRoute from './router/router';
import Login from './pages/Login.js'
import Register from './pages/Register.js';
function App() {

  return (
    <div className="App">
       {
        window.localStorage.getItem("roleId")== null ? window.localStorage.getItem("isToRegister")== "true" ? <Register></Register>: <Login></Login>: <MyRoute/> 
      }
    </div>
  )

}

export default App;
