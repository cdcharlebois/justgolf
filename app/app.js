// Global
Courses = new Mongo.Collection('courses');
Scores  = new Mongo.Collection('scores');

if (Meteor.isClient) {
  // default state
  Session.set('s_pickingCourse', true);
  // counter starts at 0
  // Session.setDefault('counter', 0);

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get('counter');
  //   }
  // });

  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set('counter', Session.get('counter') + 1);
  //   }
  // });
  ////////////////////////////////////////////////////////////////////////
  Template.enterScore.helpers({
    courses: function(){
      return Courses.find();
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
  
  ////////////////////////////////////////////////////////////////////////
  //  PICK COURSE
  ////////////////////////////////////////////////////////////////////////
  Template.pickCourse.helpers({
    courses: function(){
      return Courses.find();
    },
    s_pickingCourse: function(){
      return (Session.get('s_pickingCourse'));
    }
  })
  Template.pickCourse.events({
    'click .pickCourse-go': function(e,t){
      Session.set('s_pickingCourse', false);
      Session.set('courseName', Courses.findOne({_id: t.find('select').value}).name);
      Session.set('s_enteringScore', true);
    }
  });

  ////////////////////////////////////////////////////////////////////////
  //  ENTER SCORE
  ////////////////////////////////////////////////////////////////////////
  Template.enterScore.helpers({
    s_enteringScore: function(){
      return Session.get('s_enteringScore');
    },
    courseName: function(){
      return Session.get('courseName');
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
