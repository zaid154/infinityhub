import Brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const brevoTransactionalApi = new Brevo.TransactionalEmailsApi();
export const brevoContactsApi = new Brevo.ContactsApi();

export default Brevo;
