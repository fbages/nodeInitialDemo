// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import packageInfo from 'package.json';
//require('dotenv').config();

export const environment = {
  production: false,
  version: packageInfo.version,
  GOOGLE_API_KEY: '734855494394-5rs0al4gnaks6ivm5vds9r22v9g01090.apps.googleusercontent.com'
};
