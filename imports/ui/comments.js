import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Comments } from '../api/comments.js';

import './comments.html';

export const isCommenting = new ReactiveDict();

Template.comment.onCreated(function() {
  isCommenting.set(this.data._id, false);
  Meteor.subscribe('comments', this.data._id);
});

Template.comment.helpers({
  comments() {
    return Comments.getThread(this._id);
  },
  isCommenting() {
    return isCommenting.get(this._id);
  },
  isAuthor() {
    return this.authorId === Meteor.userId();
  }
});

Template.comment.events({
  'click .js-reply'(event) {
    isCommenting.set(this._id, true);
    return false;
  }
});

Template.postComment.onRendered(function() {
  this.find('textarea').focus();
});

Template.postComment.events({
  'submit form'(event) {
    const target = event.target;
    const authorId = Meteor.userId();
    const content = target.content.value;

    Meteor.call('comments.insert', {
      discussionId: this.discussionId || this._id,
      parentId: this._id,
      parentSlug: this.slug || undefined,
      parentFullSlug: this.fullSlug || undefined,
      authorId,
      content
    });

    // Clear form
    target.content.value = '';

    isCommenting.set(this._id, false);
    return false;
  },
  'click .js-cancel'(event) {
    isCommenting.set(this._id, false);
    return false;
  }
});
