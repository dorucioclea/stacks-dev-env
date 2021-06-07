FROM blockstack/stacks-blockchain:2.0.11.1.0-stretch as build

FROM debian:stretch

RUN apt-get update && \
    apt-get install dos2unix && \
    apt-get clean

COPY wait-for-it.sh /bin/wait-for-it.sh
RUN dos2unix /bin/wait-for-it.sh
RUN chmod +x /bin/wait-for-it.sh

COPY docker-entrypoint.sh /bin/
RUN dos2unix /bin/docker-entrypoint.sh
RUN chmod +x /bin/docker-entrypoint.sh

COPY --from=build /bin/stacks-node /bin/

ENTRYPOINT ["/bin/docker-entrypoint.sh"]
CMD ["stacks-node"]
