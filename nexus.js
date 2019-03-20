const inquirer = require("inquirer");
const clipboardy = require("clipboardy");
var request = require("request");

inquirer
  .prompt([
    {
      type: "list",
      name: "env",
      message: "Choose environment",
      choices: ["Integration", "Production"]
    },
    {
      type: "input",
      name: "MD_API_KEY",
      message: "What is your MD-API-KEY"
    },
    {
      type: "input",
      name: "client_id",
      message: "What is your client_id"
    },

    {
      type: "input",
      name: "user_id",
      message: "What is your user_id"
    }

    // {
    //   type: "list",
    //   name: "theme",
    //   message: "Which Nexus endpoint would you like to hit?",
    //   choices: [
    //     "Accounts",
    //     "Budgets",
    //     "Categories",
    //     "Goals",
    //     "Holdings",
    //     "Identity",
    //     "Institutions",
    //     "Jobs",
    //     "Member Credentials",
    //     "Members",
    //     "Merchants",
    //     "Monthly Cash Flow Profile",
    //     "Notifications",
    //     "Scheduled Payments"
    //   ]
    // }
  ])
  .then(answers => {
    if (answers.env === "Production") {
      envURL = "sso.";
    } else {
      envURL = "int-sso.";
    }

    client_id = answers.client_id;
    user_id = answers.user_id;
    MD_API_KEY = answers.MD_API_KEY;

    console.log(
      (cURL =
        "curl -i https://" +
        envURL +
        "moneydesktop.com/" +
        answers.client_id +
        "/users/" +
        answers.user_id +
        "/api_token.xml \\" +
        "\n" +
        "   " +
        "-H " +
        '"Accept: application/vnd.moneydesktop.sso.v3+xml" \\ ' +
        "\n" +
        "   " +
        "-H " +
        '"MD-API-KEY: ' +
        answers.MD_API_KEY +
        '" ')
    );

    inquirer
      .prompt([
        {
          type: "list",
          name: "send",
          message: "Create Session?",
          choices: ["Yes", "No"]
        }
      ])

      .then(answers => {
        if (answers.send === "Yes") {
          let options = {
            method: "GET",
            url: `https://${envURL}moneydesktop.com/${client_id}/users/${user_id}/api_token.xml`,
            headers: {
              "MD-API-KEY": MD_API_KEY,
              Accept: "application/vnd.moneydesktop.sso.v3+json"
            }
          };

          request(options, function(error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
          });
        }
      });
  });
