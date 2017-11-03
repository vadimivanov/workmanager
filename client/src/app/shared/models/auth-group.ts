import { AuthService } from '../services/auth/auth.service';
import { User } from './user.model';

export class AuthGroup {
  currentUser: User;
  userRole: string;
  isUnregister: Boolean = false;
  isSupporter: Boolean = false;
  isRater: Boolean = false;
  isProvider: Boolean = false;
  profileRoute: string;
  feedbackRoute: string;
  dashboardRoute: string;

  currentRole: Object;

  constructor(private authService: AuthService) {
    this.userRole = authService.getUserRole();
    this.currentUser = authService.getUser();
  }

}
