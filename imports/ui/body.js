import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';

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

Template.body.events({
  'submit .new-article'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const authorId = target.authorId.value;
    const title = target.title.value;
    const content = target.content.value;

    // Insert a task into the collection
    Meteor.call('articles.insert',
      { authorId, title, content });

    // Clear form
    target.authorId.value = '';
    target.title.value = '';
    target.content.value = '';
  },
  'click .edit'(event) {
    event.preventDefault();
    const articleContainer = event.target.parentNode.parentNode.parentNode;
    $(articleContainer).find('.article-view').hide();
    $(articleContainer).find('.edit-view').show();
  },
  'click .save'(event) {
    event.preventDefault();

    // Get value from form element
    const articleContainer = event.target.parentNode.parentNode.parentNode.parentNode;
    const title = $(articleContainer).find('.edit-view .title').val();
    const content = $(articleContainer).find('.edit-view .content').val();

    Meteor.call('articles.update', this._id, { title, content });

    $(articleContainer).find('.edit-view').hide();
    $(articleContainer).find('.article-view').show();
  },
  'click .delete'(event) {
    event.preventDefault();
    Meteor.call('articles.remove' ,this._id);
  }
});
