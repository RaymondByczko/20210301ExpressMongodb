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