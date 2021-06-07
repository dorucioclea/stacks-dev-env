FROM alpine

RUN apk --update --no-progress  --no-cache upgrade

RUN apk add \
    dos2unix \
    --no-cache

COPY ./setup-bns.sh .

RUN dos2unix setup-bns.sh
