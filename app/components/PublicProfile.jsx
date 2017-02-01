import React from 'react';
import axios from 'axios';
import PublicLessons from './PublicLessons';
import { Match, Link} from 'react-router';

export default class PublicProfile extends React.Component {

  componentWillMount() {
    const id = Number(location.pathname.slice(6, 7));

    axios.get(`/api/userData/${id}`)
      .then(res => {
        this.props.getUserData(res.data).bind(this);
      })
      .catch(err => {
      console.log(err);
    });
  }

  render() {
    if (this.props.userData.length === 0) {
      return <div></div>;
    }

    return (
      <div className="row">

        <div className="row" id="profile-container">
          <div className="col s8 offset-s2">
            <div className="row remove-margin">
              <div className="col s8">
                <h3 id="username">{this.props.userData[0].name}</h3>
                {this.props.userData[0].bio.length > 0 &&
                  <h5 id="user-bio">{this.props.userData[0].bio}</h5>
                }
              </div>
            </div>
          </div>
          <div id="profile-img">
            {this.props.userData[0].photoUrl.length > 0 &&
              <img className="img-circle" src={this.props.userData[0].photoUrl} height="100px" width="100px;" />
            }
          </div>
          <div className="row center-align">
            <div className="col s12 m8 offset-m2">
              <div className="row">
              <ul id="profile-section">
                <li>
                  <div className="col s4 section-title">
                    <h5><Link to={`/user/${Number(location.pathname.slice(6, 7))}/lessons`}>Lessons</Link></h5>
                  </div>
                </li>
              </ul>
            </div>
            </div>
          </div>
        </div>

        <div className="row align-center">
          <div className="col s12 m6 offset-m3">
            <Match pattern={`/user/${Number(location.pathname.slice(6, 7))}/lessons`} exactly render={
              () => <PublicLessons myLessons={this.props.myLessons}
                                  getMyLessons={this.props.getMyLessons}
                                  favorites={this.props.favorites}
                                  getFavorites={this.props.getFavorites}
                       />
            }/>
          </div>
        </div>
      </div>
    );
  }
}
