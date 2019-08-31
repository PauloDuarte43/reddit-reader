ng build -c production --aot && aws s3 rm s3://reddit.pauloduarte.tk --recursive && aws s3 cp ./dist/reddit-reader s3://reddit.pauloduarte.tk --recursive --acl public-read
