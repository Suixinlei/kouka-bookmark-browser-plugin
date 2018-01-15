import Exceed from 'exceed';

const exceed = new Exceed({
  csrf: false,
  ENV: 'prod',
});

const INTERFACE = [
  {
    name: '书签列表',
    id: 'Bookmark.list',
    method: 'get',
    urls: {
      prod: '/api/bookmark/list',
    }
  },
];

exceed.use(INTERFACE);

exceed.interceptors.request.push((requestParams, config) => {
  requestParams.url = 'http://47.97.170.90' + requestParams.url;
});

export default exceed;