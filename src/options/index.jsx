import React from 'react';
import { Button } from 'antd';
import exceed from 'utils/apimap';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookmarkList: [],
    }
  }
  componentDidMount() {
    exceed.fetch({
      api: 'Bookmark.list',
    })
      .then(list => {
        if (list.status === 'success') {
          this.setState({
            bookmarkList: list.data,
          });
        }
      });
  }

  render() {
    return (
      <div>
        {
          this.state.bookmarkList.map(bookmark => <span>{bookmark.title}</span>)
        }
      </div>
    )
  }
}

const mountNode = document.getElementById('container');
ReactDOM.render(
  <Root />
  , mountNode);