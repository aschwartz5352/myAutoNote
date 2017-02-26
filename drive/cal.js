var CLIENT_ID = '1020202946130-7ojreg61fatq020ccnhgnal0gu8l2ls8.apps.googleusercontent.com';
        // Array of API discovery doc URLs for APIs used by the quickstart
        var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        // Authorization scopes required by the API; multiple scopes can be
        // included, separated by spaces.
        var apiKey = 'AIzaSyBLtadLS0UpmV8rlQ8Bz7pOcPy8avTbTr4';
        var SCOPES = "https://www.googleapis.com/auth/calendar";
        var authorizeButton = document.getElementById('authorize-button');
        var signoutButton = document.getElementById('signout-button');
        /**
         *  On load, called to load the auth2 library and API client library.
         */
        function handleClientLoad() {
            gapi.load('client:auth2', initClient);
        }
        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        function initClient() {
            gapi.client.init({
                contentType : "application/json",
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(function () {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                gapi.client.setApiKey(apiKey);
                // Handle the initial sign-in state.
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                authorizeButton.onclick = handleAuthClick;
                signoutButton.onclick = handleSignoutClick;
            });
        }
        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                authorizeButton.style.display = 'none';
                signoutButton.style.display = 'block';
                listUpcomingEvents();
            } else {
                authorizeButton.style.display = 'block';
                signoutButton.style.display = 'none';
            }
        }
        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick(event) {
            gapi.auth2.getAuthInstance().signIn();
        }
        /**
         *  Sign out the user upon button click.
         */
        function handleSignoutClick(event) {
            gapi.auth2.getAuthInstance().signOut();
        }
        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        function appendPre(message) {
            var pre = document.getElementById('content');
            var textContent = document.createTextNode(message + '\n');
            pre.appendChild(textContent);
        }
        /**
         * Print the summary and start datetime/date of the next ten events in
         * the authorized user's calendar. If no events are found an
         * appropriate message is printed.
         */
        function listUpcomingEvents() {
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 10,
                'orderBy': 'startTime'
            }).then(function(response) {
                var events = response.result.items;
                appendPre('Upcoming events:');
                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                        var event = events[i];
                        var when = event.start.dateTime;
                        if (!when) {
                            when = event.start.date;
                        }
                        appendPre(event.summary + ' (' + when + ')')
                    }
                } else {
                    appendPre('No upcoming events found.');
                }
            });
        }
        
        function makeEvent(text) {
            /*request = gapi.client.calendar.events.quickAdd({
                'calendarId': 'primary',
                'text': text
            });
            request.execute(function(event) {
                appendPre('Event created: ' + event.htmlLink);
            });*/
        }
        function findDate(noteLine) {
            
            var request;
            var content = noteLine.split(' ');
            var days = [" mondays "," tuesday ", " wednesday ", " thursday ", " friday ", " saturday ", " sunday ",
                " mon "," tues "," tue "," wed "," thu "," thur "," fri "," sat "," sun ",
                "tomorrow","tmrw","tmw", "pm ", "am "];
            
            for (var word = 0; word < content.length; word++) {
                console.log("word: "+content[word]);
                if (content[word].toLowerCase() in days) {
                    console.log("THIS PASSES with DAYS!!!");
                    makeEvent(content[word]);
                    return true;
                    //TODO: ADD POPUP TO OFFER CREATE CALENDAR EVENT
                }
                if (content[word].includes('/') || content[word].includes('-')) {
                    var text = content[word];
                    var reg = new RegExp(/^(([0-9]){1,2})(\/|-)(([0-9]){1,2})((\/|-)((([0-9]){4})|(([0-9]){2})))?$/);
                    if (text.match(reg)) {
                        console.log("THIS PASSES with REGEX!!!");
                        makeEvent(text);
                        return true;
                        //TODO: ADD POPUP TO OFFER CREATE CALENDAR EVENT
                    }
                }
            }
            return false;
        }