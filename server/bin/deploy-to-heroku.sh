#!/usr/bin/env bash
BRANCH_TO_DEPLOY="master"

#TODO run heroku login with credentials here

echo "You must login to heroku cli."
if ! git ls-remote --exit-code --refs heroku; then
  git remote add heroku https://git.heroku.com/okornok.git
fi
git push -u heroku $BRANCH_TO_DEPLOY
echo "Deploy branch ${BRANCH_TO_DEPLOY} to heroku done."
