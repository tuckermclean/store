import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './body.html';

Template.body.helpers({
  articles() {
    return Articles.find({});
  },
});
