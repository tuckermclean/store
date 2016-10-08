import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Comments } from '../api/comments.js';

import './comments.html';

export const isReplying = new ReactiveDict();

Template.comment.onCreated(function() {
  isReplying.set(this.data._id, false);
  Meteor.subscribe('comments', this.data._id);
});

Template.comment.helpers({
  comments() {
    return Comments.getThread(this._id);
  },
  isReplying() {
    return isReplying.get(this._id);
  }
});

Template.comment.events({
  'click .js-reply'(event) {
    isReplying.set(this._id, true);
    return false;
  }
});

Template.postComment.events({
  'submit form'(event) {
    const target = event.target;
    const authorId = target.authorId.value;
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
    target.authorId.value = '';
    target.content.value = '';

    isReplying.set(this._id, false);
    return false;
  }
});
