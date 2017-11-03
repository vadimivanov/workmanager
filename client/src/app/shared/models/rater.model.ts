import {User} from './user.model';

export class Rater extends User {
  id: number;
  about: string;
  email: string;
  city: string;
  first_name: string;
  last_name: string;
  occupation: string;
  photo_url: string;
}
