closetickets
============


TODO:

- General Stuff
    - Change all references from "listings" to "tickets".. makes more sense
    - Apply my new create object, create query, and create ACL functions everywhere ( already done for the most part )
    - Secure/check/validate data with cloud functions
    - Rearrange all the modules

- Homepage
    - *** debating if homepage should be the map page and just overlay the page what is on the homepage if not logged in ****
    - action upon arrival if logged in
    - button actions
    - feature list
    - Re-implement Facebook sign-up. Keep email in some form though.

- Map Page
    - **DONE** Finish up the UI for placing pin (hiding/showing buttons)
    - ** FIGURE OUT WHAT'S GOING ON WITH GOOGLE RETURNING DIFFERENT NAMED KEYS FOR LOCATION
    - ** CAN BE FOUND IN PARSE.JS WHEN CREATING LISTING
    - Error handling for forms
    - Pin window
    - Search by distance from location
    - Fallback location finder
    - Manage pins
    - Swipe to hide/show side menu ( not off-canvas menu )

- Static pages
    - Create legal if needed
    - about company page
    - contact

- Off-canvas Menu
    - **DONE** Make it aware of the user status ( profile image/name, links to be shown )
    - **DONE** make a messaging system
    - Keep headers fixed to top maybe?

- Server
    - **NOT DOING - implemented messaging instead** Email pipe in node






BUGS:

- Adding a location north of current location leads to NaN (not a number). Something goofy going on there.
























WHAT I NEED:










Init:
-

User:
- createUser ( add facebook )
- logIn (add facebook)
- logOut
- resetPassword


Tickets:
- Add ticket
- Delete ticket
- Query tickets

Messages:
- Add message
- (?) Delete message
- Query messages
- Query conversations
- Conversation exists check
- Create conversation


Queries:
- queryListings *options
- queryMessagesByConversationId *id
- queryConversations
- queryUserObject (findUser function exists already but needs altered to do clean Id's )

Add:
- addListing
- addConversation
- addMessage

Delete:
- Delete listings
- Delete messages?

Slides:
- addSlide
- removeSlide
- goToSlide
- slideNumber

Parse Utility:
- createACL
- createObject
- createQuery
- checkConversation

Map:
- Same
- (?) Add a current latitude and current area box
  https://developers.google.com/maps/documentation/javascript/reference?csw=1


UI:
binds for each form and button actions














