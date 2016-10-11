import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';
import { Articles } from '../api/articles.js';

import '../api/users.js';
import './body.html';

Tracker.autorun(function() {
  Meteor.subscribe('userData');
  const user = Meteor.users.findOne({});
  if (user !== undefined && Meteor.status().connected) {
    Session.set('connected', true);
  } else {
    Session.set('connected', false);
  }
})

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('articles');
});

Template.body.helpers({
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  },
  connected() {
    return Session.get('connected');
  },
  isPosting() {
    return Session.get('isPosting');
  }
});

Template.body.events({
  'click .js-post'(event) {
    Session.set('isPosting', true);
    return false;
  }
});
