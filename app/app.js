// Global
Courses = new Mongo.Collection('courses');

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  ////////////////////////////////////////////////////////////////////////
  Template.createCourse.helpers({
    courseName: function(){
      return Session.get('courseName') || "New Course";
    }
  });

  Template.createCourse.events({
    'keyup .courseName': function(e){
      Session.set('courseName', e.target.value);
    },
    'click .addCourse':function(e,t){
      var elems = t.findAll('.par'),
          pars = [];
      for (var i in elems)
        pars.push(elems[i].value*1);
      var newCourse = {name: Session.get('courseName'), holes: pars};
      console.log(newCourse);
      Courses.insert(newCourse);
      // console.log(pars);
    }
  });

  Template.listCourses.helpers({
    courses: function(){
      return Courses.find();
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
