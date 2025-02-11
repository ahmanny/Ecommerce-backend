import mailjet from "node-mailjet";

const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY as string,
    process.env.MAILJET_API_SECRET as string
);

export default mailjetClient;