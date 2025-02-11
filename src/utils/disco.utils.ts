import fs from 'fs/promises'; // Correct fs import
import Handlebars from 'handlebars';
import path from 'path';


interface verificationEmailData {
    senderName: string
    discoName: string
    token: string,
    email: string,
    name: string
}


export async function getVerificationEmailContent({ senderName, discoName, token, email, name }: verificationEmailData): Promise<string> {
    try {
        const clientRegisterUrl = process.env.CLIENT_REGISTER_URL
        const templatePath = path.resolve(__dirname, '..', 'templates', 'emailVerification.template.hbs');

        const templateSource = await fs.readFile(templatePath, 'utf-8');

        const template = Handlebars.compile(templateSource);

        return template({ senderName, discoName, token, email, name: encodeURIComponent(name), clientRegisterUrl, encodeEmail: encodeURIComponent(email) });
    } catch (error) {
        console.error("Error reading or compiling template:", error);
        throw error;
    }
}