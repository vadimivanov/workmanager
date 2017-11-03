import { Injectable } from '@angular/core';

import { Provider } from '../models/provider.model';
import { Rater } from '../models/rater.model';
import { Feedback } from '../models/feedback.model';

@Injectable()
export class FormUtilsService {
  provider: Provider = new Provider('', '', '');
  rater: Rater = new Rater('', '', '');
  feedback: Feedback = new Feedback();

  constructor() { }

}
