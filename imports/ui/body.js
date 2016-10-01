import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Blaze } from 'meteor/blaze';
import { $ } from 'meteor/jquery';

import { Articles } from '../api/articles.js';
import { Comments } from '../api/comments.js';

import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  Meteor.subscribe('articles');
  Meteor.subscribe('comments');
});

Template.body.helpers({
  articles() {
    return Articles.find({}, { sort: { createdAt: -1 } });
  }
});

Template.article.helpers({
  comments(parentId) {
    return Comments.find({parentId});
  }
});

Template.comment.helpers({
  comments(parentId) {
    return Comments.find({parentId});
  }
});

Template.body.events({
  'click form.post-comment button'(event) {
    const targetForm = $(event.target).parents('form')[0];
    const authorId = targetForm.authorId.value;
    const content = targetForm.content.value;

    Meteor.call('comments.insert', {
      discussionId: this.discussionId || this._id,
      parentId: this._id,
      parentSlug: this.slug || undefined,
      parentFullSlug: this.fullSlug || undefined,
      authorId,
      content
    });

    // Clear form
    targetForm.authorId.value = '';
    targetForm.content.value = '';

    $('.post-comment-view:not(.hidden)').addClass('hidden');
    $('button.comment.hidden').removeClass('hidden');
    return false;
  },
  'submit .post-article'(event) {
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

    return false;
  },
  'click .comment'(event) {
    const target = event.target;
    const commentContainer = $(target).parents('.comment')[0];
    const articleContainer = $(target).parents('.article')[0];

    if (commentContainer) {
      $(commentContainer).find('.post-comment-view').removeClass('hidden');
      $(commentContainer).find('.comment').addClass('hidden');
    } else {
      $(articleContainer).find('.post-comment-view').removeClass('hidden');
      $(articleContainer).find('.comment').addClass('hidden');
    }

    return false;
  },
  'click .edit-article'(event) {
    const articleContainer = $(event.target).parents('.article')[0];

    $(articleContainer).find('.article-view').addClass('hidden');
    $(articleContainer).find('.edit-article-view').removeClass('hidden');

    return false;
  },
  'submit .save-article'(event) {
    // Get value from form element
    const target = event.target;
    const articleContainer = $(target).parents('.article')[0];
    const title = target.title.value;
    const content = target.content.value;

    Meteor.call('articles.update', this._id, { title, content });

    $(articleContainer).find('.edit-article-view').addClass('hidden');
    $(articleContainer).find('.article-view').removeClass('hidden');

    return false;
  },
  'click .delete-article'(event) {
    Meteor.call('articles.remove' ,this._id);
    return false;
  }
});
