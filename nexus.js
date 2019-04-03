const inquirer = require("inquirer");
const request = require("request");
const parseString = require("xml2js").parseString;

inquirer
  .prompt([
    {
      type: "list",
      name: "session",
      message: "Do you have a session token or do you need to create one?",
      choices: ["Yes", "No - create session token"]
    }
  ])
  .then(answers => {
    if (answers.session === "Yes") {
      enableEndpoints();
    } else {
      createSession();
    }
  });


  
function createSession() {
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
              parseString(body, function(err, result) {
                console.log(result.api_token.token[0]);
                apiToken = result.api_token.token[0];
                if (envURL === "sso.") {
                  dataURL = "data.";
                } else {
                  dataURL = "int-data.";
                }

                let options2 = {
                  method: "POST",
                  url: `https://${dataURL}moneydesktop.com/sessions`,
                  headers: {
                    Accept: "application/vnd.mx.nexus.v1+json",
                    "Content-Type": "application/vnd.mx.nexus.v1+json",
                    "MD-API-TOKEN": `${apiToken}`
                  }
                };

                request(options2, function(error, response, body) {
                  if (error) throw new Error(error);
                  console.log("============Session Created!================");
                  console.log(body);
                  console.log("============================================");
                  enableEndpoints();
                });
              });
            });
          }
        });
    });
}

function enableEndpoints() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "session_token",
        message: "Enter your session token"
      }
    ])
    .then(answers => {
      sessionToken = answers.session_token;
      console.log(sessionToken);
      inquirer
        .prompt([
          {
            type: "list",
            name: "endpoint",
            message: "Which Nexus endpoint would you like to hit?",
            choices: [
              "Accounts",
              "Budgets",
              "Categories",
              "Goals",
              "Holdings",
              "Identity",
              "Institutions",
              "Jobs",
              "Member Credentials",
              "Members",
              "Merchants",
              "Monthly Cash Flow Profile",
              "Notifications",
              "Scheduled Payments"
            ]
          }
        ])
        .then(answers => {
          if (answers.endpoint === "Accounts") {
            console.log("accounts endpoint working");
          }
        });
    });
}
