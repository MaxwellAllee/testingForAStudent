import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import API from '../../lib/API';
import TokenStore from '../../lib/TokenStore';
import AuthContext from '../../contexts/AuthContext';
import Navigation from '../../components/Navigation/Navigation';
import PrivateRoute from '../../components/PrivateRoute/PrivateRoute';
// import AddBook from '../../components/AddBook/AddBook';
import Login from '../../pages/Login/Login';
// import Secret from '../../pages/Secret/Secret';
import Home from '../../pages/Home/Home';
import NotFound from '../../pages/NotFound/NotFound';
import './App.css';
import MyLibrary from '../../pages/MyLibrary/MyLibrary';
import AddBooks from '../../pages/AddBooks/AddBooks';
import SearchBooks from '../../pages/SearchBooks/SearchBooks'
class App extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = (user, authToken) => {
      TokenStore.setToken(authToken);
      this.setState(prevState => ({ auth: { ...prevState.auth, user, authToken } }));
    };

    this.handleLogout = () => {
      TokenStore.clearToken();
      this.setState(prevState => ({ auth: { ...prevState.auth, user: undefined, authToken: undefined } }));
    }

    this.state = {
      auth: {
        user: undefined,
        authToken: TokenStore.getToken(),
        onLogin: this.handleLogin,
        onLogout: this.handleLogout
      }
    }
  }

  componentDidMount() {
    const { authToken } = this.state.auth;
    if (!authToken) return;

    API.Users.getMe(authToken)
      .then(response => response.data)
      .then(user => this.setState(prevState => ({ auth: { ...prevState.auth, user } })))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.auth}>
        <div className='App'>
          <Navigation />
          <div className='container'>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              {/* <PrivateRoute path='/secret' component={Secret} /> */}
              <PrivateRoute path='/MyLibrary' component={MyLibrary} />
              <PrivateRoute path='/SearchBooks' component={SearchBooks} />
              <PrivateRoute path='/AddBooks' component={AddBooks} />
              <Route component={NotFound} />
          </Switch>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }
}

export default App;