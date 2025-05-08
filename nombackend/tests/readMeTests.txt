to create a test, simply add a new test in the file that has the test on it.

Server.js is the original file whereas server.test.js is the testing file meaning you just add your tests to server.test.js if anything is in there you want to test

a test can be easily created by doing:
test("TEST NAME AND DESCRIPTOR", () => {
    //run your tests here
})

If a new file has been made such as smtp.js, simply add a new file in tests with the name of the file and test in its name: smtp.test.js

Once your tests are made, to run them call: "npm test" to run the tests.