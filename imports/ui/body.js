import { Template } from 'meteor/templating';

import { Articles } from '../api/articles.js';

import './body.html';

Template.body.helpers({
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  },
});

Template.body.events({
  'submit .new-article'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const title = target.title.value;
    const content = target.content.value;

    // Insert a task into the collection
    Articles.insert({
      title,
      content,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.title.value = '';
    target.content.value = '';
  },
});
