import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Articles } from '../api/articles.js';
import { Comments } from '../api/comments.js';

import './articles.html';

export const isEditing = new ReactiveDict();

Template.article.onCreated(function() {
  isEditing.set(this.data._id, false);
  Meteor.subscribe('comments', this.data._id);
});

Template.article.helpers({
  isEditing() {
    return isEditing.get(this._id);
  },
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  }
});

Template.displayArticle.helpers({
  comments() {
    return Comments.getThread(this._id);
  },
  isAuthor() {
    return this.authorId === Meteor.userId();
  }
});

Template.postArticle.events({
  'submit form'(event) {
    // Get value from form element
    const target = event.target;
    const authorId = Meteor.userId();
    const title = target.title.value;
    const content = target.content.value;

    // Insert a task into the collection
    Meteor.call('articles.insert',
      { authorId, title, content });

    // Clear form
    target.title.value = '';
    target.content.value = '';

    isEditing.set(this._id, false);
    return false;
  },
});

Template.displayArticle.events({
  'click .js-edit'(event) {
    isEditing.set(this._id, true);
    return false;
  },
});

Template.editArticle.events({
  'submit form'(event) {
    // Get value from form element
    const target = event.target;
    const articleContainer = $(target).parents('.article')[0];
    const title = target.title.value;
    const content = target.content.value;

    Meteor.call('articles.update', this._id, { title, content });

    isEditing.set(this._id, false);
    return false;
  },
  'click .js-delete'(event) {
    Meteor.call('articles.remove' ,this._id);
    return false;
  },
  'click .js-cancel'(event) {
    isEditing.set(this._id, false);
    return false;
  }
});
