
const GitHub = require('github-api');
const inquirer = require("inquirer");
const fs = require("fs");
const HTMLToPDF = require("html-to-pdf");

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

// generate profile
function generate_profile() {
    inquirer
        // get username and favorite color
        .prompt(questions)
        .then(function (response) {
            //console.log(JSON.stringify(response))
            //console.log(JSON.stringify(response.username))
            //console.log(JSON.stringify(response.color))

            let me = gh.getUser(response.username);
            let repos = me.listRepos();
            let profile = me.getProfile()

            // get profile and repos
            Promise.all([repos, profile]).then(function (values) {
                // create profile_data
                //console.log(profile)
                let profile_data = {
                    profile_pic_url: values[1].data.avatar_url,
                    full_name: values[1].data.name,
                    user_name: values[1].data.login,
                    location: values[1].data.location,
                    google_map_link: `https://www.google.com/maps/place/${values[1].data.location}`.replace(/\s+/g, "+"),
                    github_profile_link: values[1].data.html_url,
                    blog_link: values[1].data.blog,
                    bio: values[1].data.bio,
                    num_repos: values[1].data.public_repos,
                    num_followers: values[1].data.followers,
                    num_stars: 0,
                    num_following: values[1].data.following,
                    color: response.color
                }

                values[0].data.forEach(repo => {
                    profile_data.num_stars += parseInt(repo.stargazers_count)
                })

                //console.log(profile_data);

                // update html and css

                let html = `<!DOCTYPE html>
            <html lang='en'>

            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content="width=device-width, initial-scale=1">
                <title class="title name">Resume Profile</title>
                <!-- Google Font Almendra Style Sheet -->
                <link href='https://fonts.googleapis.com/css?family=Almendra' rel='stylesheet'>
                <link href='https://fonts.googleapis.com/css?family=Alef' rel='stylesheet'>
                <style>
                    html {
                        background-color: ${profile_data.color};
                    }

                    #profile {
                        background-color: white;
                        padding: 5%;
                        border-radius: 10%;
                    }

                    header {
                        width: 95%;
                        display: inline-block;
                        text-align: end;
                        font-family: 'Alef';
                    }

                    .logo {
                        float: left;
                        margin-left: 5%;
                    }

                    #profile_pic_url {
                        float: right;
                        width: 47.5%;
                        border: 10px solid ${profile_data.color};
                        border-radius: 10%;
                    }

                    #profile_info {
                        width: 45%;
                        margin-left: 2.5%;
                        margin-right: 2.5%;
                    }

                    #name {
                        font-family: 'Almendra';
                        display: block;
                        text-align: center;
                    }

                    #under_name_links {
                        display: block;
                        margin-bottom: 5%;
                        text-align: center;
                        font-family: 'Alef';
                        font-size: 12px;
                    }

                    #username_tag a{
                        /* Make same size as h3 */
                        text-decoration: none;
                    }

                    #google_tag a {
                        text-decoration: none;
                    }

                    #bio {
                        margin:auto;
                        margin-top: 0px;
                        margin-bottom: 5%;

                        text-align: center;
                        width: 70%;
                        font-family: 'Alef';
                        font-size: 18px;
                    }

                    table {
                        width: 70%;
                        margin: auto;
                        margin-bottom: 5%;
                        text-align: center;
                        background-color: whitesmoke;
                        border: 5px solid ${profile_data.color};
                        border-radius: 15%;
                    }

                    th td {
                        width: 80px;
                    }

                    th {
                        font-family: 'Almendra';
                        font-size: 22px;
                    }

                    td {
                        font-family: 'Alef';
                        font-size: 16px;
                    }

                </style>
            </head>

            <body class="template">
                <header>
                    <h3 class="logo">KDS Dream Tech</h3>
                    <h3><span id="filename" class="name">${profile_data.full_name}</span>'s Resume Profile</h3>
                </header>


                <div id="profile">
                    <img id="profile_pic_url" src="${profile_data.profile_pic_url}">

                    <div id="profile_info">
                        <h1>
                            <span id="name" class="name">
                                ${profile_data.full_name}
                            </span>
                        </h1>

                        <div id="under_name_links">
                            <h2 id="username_tag">
                                <a id="github_profile_link" href="${profile_data.github_profile_link}" target="_blank">
                                    <span id="username" class="username">
                                        ${profile_data.user_name}
                                    </span>
                                </a>
                            </h2>

                            <h3 id="google_tag">
                                <a id="google_map_link" href="${profile_data.google_map_link}" target="_blank">
                                    <span id="location">${profile_data.location}</span>
                                </a>
                            </h3>
                        </div>


                        <div id="main_profile">
                            <h4 id="bio">
                                ${profile_data.bio}
                            </h4>

                            <table class="num_counts">
                                <tr>
                                    <th id="num_repos">${profile_data.num_repos}</th>
                                    <th id="num_followers">${profile_data.num_followers}</th>
                                    <th id="num_stars">${profile_data.num_stars}</th>
                                    <th id="num_following">${profile_data.num_following}</th>
                                </tr>
                                <tr>
                                    <td>Repos</td>
                                    <td>Followers</td>
                                    <td>Stars</td>
                                    <td>Following</td>
                                </tr>
                            </table>


                            <table class="bottom_links">
                                <tr>

                                    <td>
                                        <a id="github_profile_link" href="${profile_data.github_profile_link}" target="_blank">
                                            Github
                                        </a>
                                    </td>

                                    <td>
                                        <a id="google_map_link" href="${profile_data.google_map_link}"
                                            target="_blank">
                                            Location
                                        </a>
                                    </td>
                                    <td>
                                        <a id="blog_link" href="${profile_data.blog_link}" target="_blank">
                                            Blog
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </body>

            </html>`


                let filename = `${profile_data.user_name}_profile.html`
                fs.writeFile(filename, html, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Wrote " + filename)
                });

            // convert file to pdf

            }).catch(err => console.error(err));
        });
};

generate_profile()
