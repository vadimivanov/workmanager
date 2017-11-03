export class User {
  firstName: string;
  lastName: string;
  telNo: string;
  gender: number;
  role: string;
  isRemembered: boolean;
  user: {
    id: number,
    role: string,
    stripe_subscription: {
      plan: {
        name: string
      }
    }
  };
  constructor(
    public login: string,
    public email: string,
    public password: string
  ) {  }
}
