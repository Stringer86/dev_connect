import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMenu: false
    }
  }

  logOut(event) {
    event.preventDefault();

    axios.delete('/token')
      .then(res => {
        this.props.authUser(false).bind(this);
      })
      .catch(err => {
        return err;
      });
  }

  signIn() {
    window.location.href = "/auth/github";
    this.props.authUser(true).bind(this);
  }

  toggleMenu() {
    this.setState({ showMenu: !this.state.showMenu });
  }

  render() {
    return (
      <div>
        <nav>
          <div>
            <h1><Link to="/" id="logo">dev connect</Link></h1>
          </div>

          <div className="headerInfo">
            {!this.props.isLoggedIn &&
              <ul id="auth-list">
                <li className="hide-small"><Link to="/signin" style={{color: '#02b875', 'fontSize': '14px'}}>Sign in</Link></li>
                <li className="hide-small" style={{color: '#02b875', 'fontSize': '14px'}}><a onClick={this.signIn.bind(this)}>GitHub</a></li>
                <li><img onClick={this.toggleMenu.bind(this)} id="menu" src="../img/menu.png" width="25px" height="25px" /></li>
              </ul>
            }

            {this.props.isLoggedIn &&
              <ul id="auth-list">
                <li className="hide-small" id="write-hook"><Link to="/write-lesson">Write a lesson</Link></li>
                <li className="hide-small"><Link to="/profile" style={{color: '#02b875', 'fontSize': '14px'}}>My Profile</Link></li>
                <li className="hide-small" onClick={this.logOut.bind(this)}><Link to="/signin" style={{color: '#02b875', 'fontSize': '14px'}}>Log Out</Link></li>
                <li><img onClick={this.toggleMenu.bind(this)} id="menu" id="menu" src="../img/menu.png" width="25px" height="25px" /></li>
              </ul>
            }

            {this.state.showMenu &&
              <div id="overlay">
                <img id="exit" onClick={this.toggleMenu.bind(this)} src="../img/delete.png" width="25px" height="25px" />
                <div id="overlay-content">
                  {!this.props.isLoggedIn &&
                    <div className="row">
                      <div className="col s6">
                        <li><Link onClick={this.toggleMenu.bind(this)} to="/signin" style={{color: '#02b875', 'fontSize': '14px'}}>Sign in</Link></li>
                      </div>
                      <div className="col s6">
                        <li className="github-link"><a onClick={this.signIn.bind(this)} style={{color: '#02b875', 'fontSize': '14px'}}>GitHub</a></li>
                      </div>
                    </div>
                  }

                  {this.props.isLoggedIn &&
                    <div className="row">
                      <div className="col s4">
                        <li id="write-hook"><Link onClick={this.toggleMenu.bind(this)} to="/write-lesson" style={{color: '#02b875', 'fontSize': '14px'}}>Write lesson</Link></li>
                      </div>
                      <div className="col s4">
                        <li><Link onClick={this.toggleMenu.bind(this)} to="/profile" style={{color: '#02b875', 'fontSize': '14px'}}>My Profile</Link></li>
                      </div>
                      <div className="col s4">
                        <li onClick={this.logOut.bind(this)}><Link onClick={this.toggleMenu.bind(this)} to="/signin" style={{color: '#02b875', 'fontSize': '14px'}}>Log Out</Link></li>
                      </div>
                    </div>
                  }
                  <h2 id="mobile-menu-title">Libraries & Frameworks</h2>
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown fadeInUp" to="/category/Angular1">Angular 1</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Angular2">Angular 2</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Backbone">Backbone</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Ember">Ember</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Meteor">Meteor</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Polymer">Polymer</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/React">React</Link><br />
                  <Link onClick={this.toggleMenu.bind(this)} className="framework-dropdown" to="/category/Vue">Vue</Link><br />
                </div>
              </div>
            }
          </div>

          <div className="col s12">
            <ul id="category-list">
              <li className="frameworks"><Link to="/category/Angular1"  >Angular 1</Link></li>
              <li className="frameworks"><Link to="/category/Angular2" >Angular 2</Link></li>
              <li className="frameworks"><Link to="/category/Backbone">Backbone</Link></li>
              <li className="frameworks"><Link to="/category/Ember">Ember</Link></li>
              <li className="frameworks"><Link to="/category/Meteor">Meteor</Link></li>
              <li className="frameworks"><Link to="/category/Polymer">Polymer</Link></li>
              <li className="frameworks"><Link to="/category/React">React</Link></li>
              <li className="frameworks"><Link to="/category/Vue">Vue</Link></li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
};
