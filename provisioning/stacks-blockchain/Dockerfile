FROM blockstack/stacks-blockchain:develop-stretch as build

FROM debian:stretch

## Add the wait script to the image

RUN chmod +x /wait

RUN apt-get update && \
    apt-get install dos2unix && \
    apt-get clean

COPY wait-for-it.sh /bin/wait-for-it.sh
RUN dos2unix /bin/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

COPY docker-entrypoint.sh /bin/
RUN dos2unix /bin/docker-entrypoint.sh
RUN chmod +x /bin/docker-entrypoint.sh

COPY wait /bin/wait
RUN chmod +x /bin/wait

COPY config.toml /src/stacks-node/Config.toml
RUN dos2unix /src/stacks-node/Config.toml

COPY --from=build /bin/stacks-node /bin/
ENTRYPOINT ["/bin/docker-entrypoint.sh"]
