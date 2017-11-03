#!/usr/bin/env bash

#CURRENT_OS=$(uname);
#
#if [ "$NODE_ENV" != "production" ]; then
#  if [ "$CURRENT_OS" == "Darwin" ] || ["$CURRENT_OS" == "Linux"]; then
#  cp ./server/bin/deploy/commit-msg ./.git/hooks/commit-msg
#  echo "File was copied"
#  else
#    if not exists .\.git\hooks\nul; then
#    mkdir .\.git\hooks
#    fi
#  copy ./server/bin/deploy/commit-msg ./.git/hooks/commit-msg
#  echo "File was copied in windows"
#  fi
#fi
#
#
#echo "OS - ${CURRENT_OS}"



if [ "$NODE_ENV" != "production" ]; then
cp ./server/bin/deploy/commit-msg ./.git/hooks/commit-msg
echo "File was copied"
fi
