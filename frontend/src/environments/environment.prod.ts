import packageInfo from 'package.json';
//require('dotenv').config();

export const environment = {
  production: true,
  version: packageInfo.version,
  GOOGLE_API_KEY: '734855494394-5rs0al4gnaks6ivm5vds9r22v9g01090.apps.googleusercontent.com'
};
