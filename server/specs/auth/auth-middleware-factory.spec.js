const { describe, it } = require('mocha');
const { expect } = require('chai');

const AuthMiddlewareFactory = require('../../auth/auth-middleware-factory');

describe('Auth middleware factory', () => {
  const dummyReq = {
    auth: {
      user: {
        id: 1,
        role: 'ADMIN',
        login: 'testLogin',
        password: 'pass',
      },
    },
  };

  it('Should be constructed by instance()', () => {
    expect(AuthMiddlewareFactory.instance()).to.be.instanceof(AuthMiddlewareFactory);
  });

  it('Check internal functions - allow user', () => {
    const user = dummyReq.auth.user;
    const authMiddlewareFactoryInstance = AuthMiddlewareFactory
      .instance()
      .allow({ id: 1, role: 'ADMIN' })
      .allow({ login: 'testLogin' });

    expect(authMiddlewareFactoryInstance.isAllowed(user)).to.be.true;
    expect(authMiddlewareFactoryInstance.isForbidden(user)).to.be.false;

    expect(authMiddlewareFactoryInstance.isAllowed({ login: 'testLogin' })).to.be.true;
    expect(authMiddlewareFactoryInstance.isForbidden({ login: 'testLogin' })).to.be.false;
  });

  it('Check internal functions isAllowed & isForbidden - not allow user', () => {
    const user = dummyReq.auth.user;
    const authMiddlewareFactoryInstance = AuthMiddlewareFactory
      .instance()
      .allow({ id: 2, role: 'ADMIN' })
      .allow({ login: 'testLogin2' });

    expect(authMiddlewareFactoryInstance.isAllowed(user)).to.be.false;
    expect(authMiddlewareFactoryInstance.isForbidden(user)).to.be.false;

    expect(authMiddlewareFactoryInstance.isAllowed({ login: 'testLogin' })).to.be.false;
    expect(authMiddlewareFactoryInstance.isForbidden({ login: 'testLogin' })).to.be.false;
  });

  it('Check internal functions isAllowed & isForbidden - forbid user', () => {
    const user = dummyReq.auth.user;
    const authMiddlewareFactoryInstance = AuthMiddlewareFactory
      .instance()
      .forbid({ id: 1 })
      .forbid({ login: 'testLogin' })
      .allow({ role: 'ADMIN' });

    expect(authMiddlewareFactoryInstance.isAllowed(user)).to.be.true;
    expect(authMiddlewareFactoryInstance.isForbidden(user)).to.be.true;

    expect(authMiddlewareFactoryInstance.isAllowed({ login: 'testLogin' })).to.be.false;
    expect(authMiddlewareFactoryInstance.isForbidden({ login: 'testLogin' })).to.be.true;
  });

  it('Allow access to users by predicate function - with login longer than 6 letters', () => {
    const user = dummyReq.auth.user;
    const longLoginPredicate = ({ login }) => login.length >= 6;

    const authMiddlewareFactoryInstance = AuthMiddlewareFactory
      .instance()
      .allow(longLoginPredicate);

    expect(authMiddlewareFactoryInstance.isAllowed(user)).to.be.true;
    expect(authMiddlewareFactoryInstance.isForbidden(user)).to.be.false;

    expect(authMiddlewareFactoryInstance.isAllowed({ login: 'short' })).to.be.false;
    expect(authMiddlewareFactoryInstance.isForbidden({ login: 'short' })).to.be.false;
  })
});
