import React from 'react';
import LessonCard from './LessonCard';
import axios from 'axios';

export default class VisitorFeed extends React.Component {
  componentDidMount() {
    axios.get('/api/lessons')
      .then(res => {
        this.props.getLessons(res.data).bind(this);
      })
      .catch(err => {
        return err;
    })
  }

  render() {
    if (this.props.lessons.length === 0) {
      return false;
    }

    const lessonList = this.props.lessons.map((lesson, index) => {
    let favorited = false;

    return <LessonCard data={lesson}
                       key={index}
                       id={lesson.id}
                       favorited={favorited}
            />
    });

    return (
      <div className="row">
        { lessonList }
      </div>
    );
  }
}
