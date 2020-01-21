/* JavaScript */

// Global Variables
//-----------------------------------
var errName = false;
var errDestination = false;
var errFirst = false;
var errFrequency = false;
var containsText = /\D/g;
var containsNumbers = /\d/g;

// Logic
//-----------------------------------

$(document).ready(function () {

    // Initialize Firebase

    var firebaseConfig = {
        apiKey: "AIzaSyC9Xj0lZfEHTfHO0jkpJq1whqJtUW6KABs",
        authDomain: "trainscheduler-81cb1.firebaseapp.com",
        databaseURL: "https://trainscheduler-81cb1.firebaseio.com",
        projectId: "trainscheduler-81cb1",
        storageBucket: "trainscheduler-81cb1.appspot.com",
        messagingSenderId: "304178649914",
        appId: "1:304178649914:web:660ea99647252144ec4e03"
    };

    firebase.initializeApp(firebaseConfig);

    var database = firebase.database();

    // Retrieve Database Snapshot on load and populate the train schedule
    var query = firebase.database().ref();

    query.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                // Pull stored train information from the database 

                var trainName = childSnapshot.child("name").val();
                var trainDestination = childSnapshot.child("destination").val();
                var firstTrain = childSnapshot.child("first").val();
                var trainFrequency = childSnapshot.child("frequency").val();

                // Calculate Next Arrival and Minutes Away

                var currentTime = moment();
                // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

                var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
                // console.log("CONVERTED TIME: " + firstTrainConverted);

                var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
                // console.log("DIFFERENCE IN TIME: " + diffTime);

                var timeRemainder = diffTime % trainFrequency;
                // console.log("REMAINDER: " + timeRemainder);

                var minutesAway = trainFrequency - timeRemainder;
                // console.log("MINUTES TILL TRAIN: " + minutesAway);

                var nextArrival = moment(currentTime, 'HH:mm A').add(minutesAway, 'minutes').format("HH:mm A")
                // console.log("NEXT ARRIVAL: " + nextArrival);

                // Create row for results timetable

                var fullList = $("<tr>").append(
                    $("<th scope='row'>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(trainFrequency),
                    $("<td>").text(nextArrival),
                    $("<td>").text(minutesAway)
                );
                // Append the row to the existing table
                $("#train-table > tbody").append(fullList);
            });
        });


    // Refresh content every minute

    setInterval(function(){ 
        updateTimetable(); 
    
    }, 60000);

    // Timetable update function

    function updateTimetable (){

        query.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                // Pull stored train information from the database 

                var trainName = childSnapshot.child("name").val();
                var trainDestination = childSnapshot.child("destination").val();
                var firstTrain = childSnapshot.child("first").val();
                var trainFrequency = childSnapshot.child("frequency").val();

                // Calculate Next Arrival and Minutes Away

                var currentTime = moment();
                // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

                var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
                // console.log("CONVERTED TIME: " + firstTrainConverted);

                var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
                // console.log("DIFFERENCE IN TIME: " + diffTime);

                var timeRemainder = diffTime % trainFrequency;
                // console.log("REMAINDER: " + timeRemainder);

                var minutesAway = trainFrequency - timeRemainder;
                // console.log("MINUTES TILL TRAIN: " + minutesAway);

                var nextArrival = moment(currentTime, 'HH:mm A').add(minutesAway, 'minutes').format("HH:mm A")
                // console.log("NEXT ARRIVAL: " + nextArrival);

                // Create row for results timetable

                var fullList = $("<tr>").append(
                    $("<th scope='row'>").text(trainName),
                    $("<td>").text(trainDestination),
                    $("<td>").text(trainFrequency),
                    $("<td>").text(nextArrival),
                    $("<td>").text(minutesAway)
                );
                // Append the row to the existing table
                $("#train-table > tbody").html(fullList);
            });
        });
    }

    // Add new train Function

    function addTrain() {

        // Store user input from form
        var trainName = $("#name").val().trim();
        // console.log("--Name--");
        // console.log(trainName);
        var trainDestination = $("#destination").val().trim();
        // console.log("--Destination--");
        // console.log(trainDestination);
        var firstTrain = ($("#first").val().trim());
        // console.log("--First Time--");
        // console.log(firstTrain);
        var trainFrequency = parseInt($("#frequency").val().trim());
        // console.log("--Frequency--");
        // console.log(trainFrequency);

        // Create local "temporary" object for holding train data
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            first: firstTrain,
            frequency: trainFrequency
        };

        // Push train data from object to the database
        database.ref().push(newTrain);

        // Alert success message
        // alert("Train successfully added");

        // Clear input boxes
        $("#name").val("");
        $("#destination").val("");
        $("#first").val("");
        $("#frequency").val("");

        // Add train to the database
        database.ref().on("child_added", function (childSnapshot) {
            // console.log(childSnapshot.val());

            // Append Train data to timetable

            query.once("value")
                .then(function (snapshot) {
                    $("#timetable").empty();
                    snapshot.forEach(function (childSnapshot) {
                        trainName = childSnapshot.child("name").val();
                        trainDestination = childSnapshot.child("destination").val();
                        trainFrequency = childSnapshot.child("frequency").val();



                        // Calculate Next Arrival and Minutes Away

                        var currentTime = moment();
                        // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

                        var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
                        // console.log("CONVERTED TIME: " + firstTrainConverted);

                        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
                        // console.log("DIFFERENCE IN TIME: " + diffTime);

                        var timeRemainder = diffTime % trainFrequency;
                        // console.log("REMAINDER: " + timeRemainder);

                        var minutesAway = trainFrequency - timeRemainder;
                        // console.log("MINUTES TILL TRAIN: " + minutesAway);

                        var nextArrival = moment(currentTime, 'HH:mm A').add(minutesAway, 'minutes').format("HH:mm A")
                        // console.log("NEXT ARRIVAL: " + nextArrival);

                        // Create row for results timetable

                        var newRow = $("<tr>").append(
                            $("<th scope='row'>").text(trainName),
                            $("<td>").text(trainDestination),
                            $("<td>").text(trainFrequency),
                            $("<td>").text(nextArrival),
                            $("<td>").text(minutesAway)
                        );
                        // Write train timetable data to the DOM

                        $("#timetable").append(newRow);
                    });
                });
        });
    }

    $(document).on("click", "#add-train", function () {

        // Prevent default form action
        event.preventDefault();

        // Clear any error messages
        $("#invalid_name").html("");
        $("#invalid_destination").html("");
        $("#invalid_first").html("");
        $("#invalid_frequency").html("");

        // Store user input in variables
        var trainName = $("#name").val().trim();
        var trainDestination = $("#destination").val().trim();
        var firstTrain = $("#first").val().trim();
        var trainFrequency = $("#frequency").val().trim();

        // Validate User Input

        // Test if null or equals 0, set or clear error message, and set error counter
        if (trainName === "" || trainName === "0") {
            $("#invalid_name").html("Please enter a valid name.");
            errName = true;
        } else {
            $("#invalid_name").html("");
            errName = false;
        }

        // Test if null or contains numbers, set or clear error message, and set error counter
        if (trainDestination === "" || containsNumbers.test(trainDestination)) {
            $("#invalid_destination").html("Please enter a valid destination.");
            errDestination = true;
        } else {
            $("#invalid_destination").html("");
            errDestination = false;
        }

        // Test if null, missing a colon, less than 4 digits, more than 24 hours, more than 59 minutes, or greater than 2400, set or clear error message, and set error counter
        if (firstTrain === "" || firstTrain.indexOf(":") < 0 || firstTrain.length < 5 || parseInt(firstTrain.substr(0, 2), 10) > 24 || parseInt(firstTrain.substr(3, 2), 10) > 59 || parseInt(firstTrain.substr(0, 2) + firstTrain.substr(3, 2)) > 2400) {
            $("#invalid_first").html("Please enter a valid time for the train's first arrival.");
            errFirst = true;
        } else {
            $("#invalid_first").html("");
            errFirst = false;
        }

        // Test if null, equals 0, or contains text, set or clear error message, and set error counter
        if (trainFrequency === "" || trainFrequency === "0" || containsText.test(trainFrequency) === true) {
            $("#invalid_frequency").html("Please enter a valid number.");
            errFrequency = true;
        } else {
            $("#invalid_frequency").html("");
            errFrequency = false;
        }

        // If no errors, call addTrain ()
        if (errName === false && errDestination === false && errFirst === false && errFrequency === false) {

            addTrain();
        }
    });
});