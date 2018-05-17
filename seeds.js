let mongoose = require("mongoose");
let Course = require("./models/courses");
let Comment = require("./models/comments");

let data = [
    {
        name:"PINE VALLEY",
        image: "https://media.golfdigest.com/photos/585054c3f9388fc41a893cac/master/w_868,c_limit/2017-01-Pine-Valley-GC-hole-15.jpg",
        description: "A genuine original, its unique character forged from the sandy pine barrens of southwest Jersey. Founder George Crump had help from now-legendary architects H.S. Colt, A.W. Tillinghast, George C. Thomas Jr. and Walter Travis. Hugh Wilson (of Merion fame) and his brother Alan finished the job. Pine Valley blends all three schools of golf design – penal, heroic and strategic – throughout the course, often times on a single hole. New tree removal at selected spots have revealed some gorgeous views of the sandy landscape upon which the course is routed."
    }, 
    {
        name:"AUGUSTA NATIONAL",
        image: "https://media.golfdigest.com/photos/5850560ff9388fc41a893cae/master/w_868,c_limit/2017-02-Augusta-National-GC-hole-12.jpg",
        description: "No club has tinkered with its golf course as often or as effectively over the decades as has Augusta National Golf Club, mainly to keep it competitive for the annual Masters Tournament, an event it has conducted since 1934, with time off during WWII. All that tinkering has resulted in an amalgamation of design ideas, with a routing by Alister Mackenzie and Bobby Jones, some Perry Maxwell greens, some Trent Jones water hazards, some Jack Nicklaus mounds and swales and, most recently, extensive rebunkering and tree planting by Tom Fazio. The tinkering may soon continue if the club, as reported, closes on a deal with adjacent Augusta Country Club to buy a portion of land that will allow the famed par-5 13th to be lengthened."
    }, 
    {
        name:"CYPRESS POINT CLUB",
        image: "https://media.golfdigest.com/photos/5850569e2991c6d81317eb2e/master/w_868,c_limit/2017-03-cypress-point-club-wide-aerial-ss.jpg",
        description: "Glamorous Cypress Point, Alister Mackenzie's masterpiece woven through cypress, sand dunes and jagged coastline, wasn't always the darling of America's 100 Greatest. Golf Digest demoted it to the Fifth Ten back in the early 1970s, saying, Its not surprising that good players might find Cypress Point wanting: it has several easy holes and a weak finisher.Our panel has since changed its collective opinion."
    }
    ]

function seedDB(){
            // Add Courses
        data.forEach(function(seed){
            Course.create(seed, function(err, course){
                if(err){
                    console.log(err);
                } else{
                    console.log("Courses added");
                    // Add Comments
                    Comment.create(
                        {
                            text:"This is a test comment This is a test comment This is a test comment",
                            author:"Jared Mudd"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else{
                                course.comments.push(comment);
                                course.save();
                                console.log("Comment Added");
                            }
                        });
                }
            });
        });
    
    };


module.exports = seedDB;