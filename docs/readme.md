# 20210301ExpressMongo

## Purpose
The purpose of this software is to provide a sample REST implementation
and to utilize express/pug in writing a website.

This site is experimental at this point, have multiple goals.  One is to provide a REST API to a rooms database
collection.  For the moment, this could be utilized for a tiny
house website.

The other goal is to use mongoose schema.

A third goal is to implement a middleware package for limiting
a user's experience with a website.

## Definitions

1. controller - a software function that is the major function
called by the callback of a route handler.
Controllers are stored in the subdirectory controllers.  The files
that implement controllers are named 'con*.js'. An example is conlimited.js.

Controllers are the result of refactoring route handler code.

## URI Route Design

#### TODO - look at REST for URI

1. Routes that involve two or more collections are specified
with first collection, slash, second collection, and then
a verb indicating what is intended.  The destination table, if applicable
is not specified in the route.

e.g. /limited/user/join

The above example implies the Limited collection will interact with the User
collection in a join operation.  The collections are presented
in alphabetical order.

## How to Create GUI to Support Join Between 2 Collections Involving a Third Intermediate Collections

#### Introduction
This might be worthy to record, for this type of problem is encountered enough.  Follow the guidance here and the indicated files for examples, if there is a need to do this type of thing.

#### Basic Approach

Create a html form, with 2 html select, populate each select dynamically (i.e. connect to mongodb).  Each select is populated with options that represent each document uniquely and easily.

Uniqueness is provided by _id of each document.  Ease of identification can be provided by a name field for example.

#### Populate select

Javascript function is provided in util.js, called populate*Select, where * is the name of the related collection.  This is one of the main implementation functions, that helps by creating the select, populating it with data given to it, and assigned it its id and appending it to the parent, whose id is also given.

Who gives the data to populate*Select?

#### The Orchestra Leader

A javascript function, bodyonload, is defined which does basically two things.  It utilizes the fetch API to obtain some data using a GET http endpoint.  With that data, it calls one of the populate*Select.

It does this sequence twice, because there is a need to setup two html select.

## Limited and Associated Data

The Limited Schema has various properties, defined by keys.  The keys are a) byGoodLoginAttempts b) byTimeOfDay c) byDayOfWeek d) byTimeTotal e) byNumberOfFilesToUpload f) byByAttempts g) bySizeOfImageUpload.  See the file models/modlimited.js for these keys in the schema.

These keys can be broken down into two groups.  One group is where associated dynamic data will need to be kept.  The other group is where this will not be necessary.

#### The First Group

Lets look at an example of the first group.  The byGoodLoginAttempts is a key that needs associated data.  For some particular user, byGoodLoginAttempts is set to 3 for example.  Before that user logs in, the associated data is 0.  When they login the first time, the associated data is set to 1.  Every time they login, the associated data is incremented in this example.

To actually Limit that user, the associated data must be compared to the limit specified for that user.  When the login attempts reaches 4, the user is denied service (i.e. they are Limited).

Members of the first group will require real time usage to be kept for them.  The usage will be compared to the Limit set in deciding whether they are Limited or not.

#### The Second Group

An example of the second group is byTimeOfDay.  Here, the time of day is not actively recorded.  It is just determined by the application, via a javascript function call etc, and it is compared to the limit established.  If the time returned is outside of the time of day, the user is limited (that is, they cannot use that part of the application).

Members of the second group do not require real time usage to be kept for them.

#### Conclusion for Limited and Associated Data

A LimitedSchema is coded in models/modlimited.  However, with the need to keep usage data for some (but not all) keys in that schema, there is a require for a LimitedUsageSchema.