import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Articles } from '../api/articles.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('articles');
});

Template.body.helpers({
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  },
});
