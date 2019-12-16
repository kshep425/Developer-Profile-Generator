const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");

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

function generateHTML(answers){
    return `<!DOCTYPE html>
    <html lang='en'>

    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content="width=device-width, initial-scale=1">
        <link href="assets/css/style.css" rel="stylesheet">
        <style>
            body {
                background-color: ${answers.color}
            }
        </style>
        <title>${answers.username} Resume Profile</title>
    </head>

    <body>
        <h1>${answers.username}</h1>
    </body>
    </html>`
}

inquirer
    .prompt(questions)
    .then(function (response) {
        console.log(JSON.stringify(response))
        console.log(JSON.stringify(response.username))
        console.log(JSON.stringify(response.color))

        profile = {
            username: response.username,
            color: response.color
        }

        // Get Num of repositories
        let num_repositories
        // Get Num of stargazers
        let num_stargazers = 0;
        axios
        .get(`https://api.github.com/users/${response.username}/repos?per_page=100`)
        .then(function(axios_response){
            console.log(Object.keys(axios_response))
            profile.num_repositories = axios_response.data.length
            console.log(profile.num_repositories)

            axios_response.data.forEach(repo => {
                console.log(repo.name, repo.stargazers_count)
                num_stargazers += repo.stargazers_count

            });
            console.log(num_stargazers)

        })
        .catch(function(err) {
            console.log(err)
        });

        // Get Num of followers
        let num_followers;
        axios
        .get(`https://api.github.com/users/${response.username}/followers`)
        .then(function(axios_response){
            num_followers = axios_response.data.length
            console.log("num_followers: "+ num_followers)
        })
        .catch(function(err){
            console.log(err)
        })

        // Get Num of following
        let num_following;
        axios
        .get(`https://api.github.com/users/${response.username}/following`)
        .then(function(axios_response){
            num_following = axios_response.data.length
            console.log("num_following: " + num_following)
        })


        // Get blog and location
        let blog;
        let location;
        let bio;
        axios
        .get(`https://api.github.com/users/${response.username}`)
        .then(function(response){
            blog = response.data.blog
            location = response.data.location
            bio = response.data.bio
            console.log(blog, location, bio)
        })

        let filename = `${response.username}_profile.html`
        fs.writeFile(filename, generateHTML(response), function(err){
            if (err) {
                return console.log(err);
            }
            console.log("Wrote " + filename)
        });
    }).catch(function(err) {
        console.log(err)
    });
