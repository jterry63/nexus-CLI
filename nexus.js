const inquirer = require("inquirer");

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
          message: "Would you like to send or copy to clipboard?",
          choices: ["Send", "Copy"]
        }
      ])

      .then(answers => {
        if (answers.send === "Send") {
          console.log("sent");
        } else {
          console.log(cURL);
        }
      });
  });
