import { environment } from '../../environments/environment';

const config: {
  apiUrl: string;
  geoApiUrl: string;
  geoApiKey: string;
  reCaptchaKey: string;
  defaultLanguage: string;
} = {
  apiUrl: undefined,
  geoApiUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
  geoApiKey: 'AIzaSyAO1j7L4Um18SsmB4tO41E8X0qFEp2FjPM',
  reCaptchaKey: '6Le8VycUAAAAAPaFBY7JrTZbDgXbCd0Ynhr2xF3S',
  defaultLanguage: 'en-us',
};

if (environment.production) {
  config.apiUrl = '';
} else {
  config.apiUrl = '/';
}

export default config;
