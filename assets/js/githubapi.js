const GitHub = require('github-api');
const inquirer = require("inquirer");

var token = process.env.GHAPITOKEN;
var gh = new GitHub({
    token: token
 });
 const questions = [
    {
        type: "input",
        message: "What is your GitHub user name?",
        name: "username"
    },
    {
        type: "input",
        message: "What is your favorite color?",
        name: "color"
    }
]

let me = gh.getUser("gvonbush");
let repos = me.listRepos();
let profile = me.getProfile()
// function getUser(){

//     inquirer
//     .prompt(questions)
//     .then(function(response){
//         me =
//     })

//     const repos = me.listRepos();
//     const profile = me.getProfile()
// }

// repos
// .then(function(response){
//     //console.log(response)
//     console.log(response.data.length)
// })
// .catch(err=>console.log(err))

// profile
// .then(function(response){
//     console.log(response.data.blog)
//     console.log(response.data.bio)
//     console.log(response.data.location)
// })
// .catch(err =>console.log(err))

Promise.all([repos, profile]).then(function(values) {
    profile_data = {
        num_repos: values[0].data.length,
        blog: values[1].data.blog,
        bio: values[1].data.bio,
        location: values[1].data.location,
        num_stargazers: 0,
        followers: values[1].data.followers,
        following: values[1].data.following,
    }
    
    values[0].data.forEach(repo => {
        profile_data.num_stargazers += parseInt(repo.stargazers_count)
    })

    console.log(profile_data);

}).catch(err => console.error(err));