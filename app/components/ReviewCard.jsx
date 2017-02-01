import React from 'react';
import { Link, Redirect } from 'react-router';
import axios from 'axios';


export default class ReviewCard extends React.Component {
  deleteLesson(event) {
    event.preventDefault();

    axios({
      method: 'delete',
      url: `/api/lessons/${this.props.publishedArticle.id}`
    })
    .then(res => {
      this.props.getPublished([]).bind(this);
      axios.get('/api/user')
        .then(res => {
          this.props.getMyLessons(res.data).bind(this);
        })
        .catch(err => {
        console.log(err);
      })
    })
    .catch(err => {
      return err;
    })
  }

  render() {
    if(this.props.publishedArticle.length === 0) {
      return false;
    }

    return (
      <div className="row">
        <div className="col s12 card">
          <div className="row cardTop">
            <div classname="col s1">
              <img className="img-circle" src={this.props.userData[0].photoUrl} height='40px' width='40px' />
            </div>
            <div className="col s10 authorName">
              <p>{this.props.userData[0].name} <span className="on"> on </span> <Link to={`/category/${this.props.publishedArticle.category}`}>{this.props.publishedArticle.category}</Link></p>
            </div>
          </div>
          <h4 className="title">{this.props.publishedArticle.title}</h4>
          <h5 className="description">{this.props.publishedArticle.description}</h5>
          <p className="read-more"><Link to={`/lesson/${this.props.publishedArticle.id}`}>Read More...</Link></p>
          <div className="btn delete" onClick={this.deleteLesson.bind(this)}><Link to="/write-lesson">Delete</Link></div>
        </div>
      </div>
    );
  }
}
