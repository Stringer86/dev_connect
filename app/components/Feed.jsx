import React from 'react';
import LessonCard from './LessonCard';
import axios from 'axios';


export default class Feed extends React.Component {
  componentDidMount() {
    function getLess() {
      return axios.get('/api/lessons')
    }
    function getFavs() {
      return axios.get('/api/favorites')
    }

    axios.all([getLess(), getFavs()])
      .then(axios.spread((lessons, favs) => {
        this.props.getLessons(lessons.data)
        this.props.getFavorites(favs.data)
      }))
      .catch(err => {
        return err;
      });
  }

  render() {
    if (this.props.lessons.length === 0) {
      return false;
    }

    const lessonList = this.props.lessons.map((lesson, index) => {
      let favorited;

      this.props.favorites.forEach((favorite) => {
        if (lesson.id === favorite.lessonId) {
          favorited = true;
        } else {
          favorited = false;
        }
      });

      return <LessonCard data={lesson}
                         key={index}
                         id={lesson.id}
                         favorited={favorited}
              />
    });

    return (
      <div>
        { lessonList }
      </div>
    );
  }
}
