#!/bin/sh

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  TARGET="$(readlink "$SOURCE")"
  if [[ $TARGET == /* ]]; then
    echo "SOURCE '$SOURCE' is an absolute symlink to '$TARGET'"
    SOURCE="$TARGET"
  else
    DIR="$( dirname "$SOURCE" )"
    echo "SOURCE '$SOURCE' is a relative symlink to '$TARGET' (relative to '$DIR')"
    SOURCE="$DIR/$TARGET" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  fi
done

echo "SOURCE is '$SOURCE'"
RDIR="$( dirname "$SOURCE" )"
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
if [ "$DIR" != "$RDIR" ]; then
  echo "DIR '$RDIR' resolves to '$DIR'"
fi

CLARITY_CLI_FILE="$DIR/clarity-cli/clarity-cli.exe"

if [ -f "$CLARITY_CLI_FILE" ]; then
    echo "$CLARITY_CLI_FILE exists, continuing with targeted installation"

    export BLOCKSTACK_CORE_SOURCE_PATH=$CLARITY_CLI_FILE && yarn

    echo "Done"
else 
    echo "$CLARITY_CLI_FILE does not exist, please read the instructions in the folder and download it"
fi