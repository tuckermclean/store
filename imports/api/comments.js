import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Random } from 'meteor/random';

export const Comments = new Mongo.Collection('comments');

Comments.getThread = function(parentId) {
  return Comments.find({parentId});
};

if (Meteor.isServer) {
  Meteor.publish('comments', Comments.getThread);
}

Comments.schema = new SimpleSchema({
  discussionId: {type: String},
  parentId: {type: String, defaultValue: null},
  slug: {type: String},
  fullSlug: {type: String},
  authorId: {type: String},
  createdAt: {type: Date},
  editedAt: {type: Date, optional: true},
  content: {type: String}
});

Comments.attachSchema(Comments.schema);

Meteor.methods({
  'comments.insert'(data) {

    const slug = Random.id(4);
    let fullSlug = `${Date.now().toString()}:${slug}`;

    if (data.parentFullSlug) {
      fullSlug = `${data.parentFullSlug}/${fullSlug}`;
    }

    return Comments.insert({
      discussionId: data.discussionId,
      parentId: data.parentId,
      slug,
      fullSlug,
      authorId: data.authorId,
      createdAt: new Date(),
      content: data.content
    });
  },
  'comments.remove'(commentId) {
    Comments.remove(commentId);
  },
  'comments.edit'(_id, content) {
    Comments.update(_id, { $set: {
        content,
        editedAt: new Date()
      } });
  }
});
