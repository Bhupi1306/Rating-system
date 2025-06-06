import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';


const googleAuth = async (id) => {
    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const serviceAccountAuth = new JWT({
      // env var values here are copied from service account credentials generated by google
      // see "Authentication" section in docs for more info
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // const doc = new GoogleSpreadsheet('17N7DM-VApNni8Mxw3iXu5SGDuRzWNkKG3GB5mN5OWp0', serviceAccountAuth);
    const doc = new GoogleSpreadsheet(id, serviceAccountAuth);
    await doc.loadInfo()

    return doc

}


export {googleAuth}
