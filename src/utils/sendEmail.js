const ses = require("./sesClient.js");

const sendInterestEmail = async (recieverEmail, senderName) => {
  const params = {
    Source: "realpankajchouhan08@gmail.com",
    Destination: {
      ToAddresses: ["pankajmarwarpay@gmail.com"],
    },
    Message: {
      Subject: {
        Data: `${senderName} is interested in your profile`,
      },
      Body: {
        Text: {
          Data: `Hi! ${senderName} has shown interest in your profile on our platform`,
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully", result.MessageId);
    return result;
  } catch (error) {
    console.error("Something went wrong while sending email", error);
    throw error;
  }
};

module.exports = sendInterestEmail;
