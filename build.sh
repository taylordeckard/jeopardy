# get absolute path of this script
CWD="$( cd "$(dirname "$0")" ; pwd -P )"

rm -fr $CWD/client/static/*

(cd $CWD/client/vue && npm install && npm run build)

cp -r $CWD/client/vue/dist/* $CWD/client/static
