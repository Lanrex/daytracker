// Only publish tasks that are public or belong to the current user
Meteor.publish("activities", function () {
  return Activities.find({
    $or: [
      { private: {$ne: true} },
      { owner: this.userId }
    ]
  });
});
