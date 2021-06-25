FROM alpine:latest

ENV BTC_CONF="/etc/bitcoin/bitcoin.conf"
ENV BTC_DATA="/root/.bitcoin"
ENV BTC_PID="/run/bitcoind.pid"

ARG BTC_URL="https://github.com/blockstackpbc/bitcoin-docker/releases/download/0.20.99.0.0/musl-v0.20.99.0.0.tar.gz"

WORKDIR /

COPY bitcoin.conf ${BTC_CONF}
RUN dos2unix ${BTC_CONF}

COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN dos2unix /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

RUN apk add --no-cache --update \
    curl \
    boost-system \
    boost-filesystem \
    boost-thread \
    boost-chrono \
    libevent \
    libzmq \
    libgcc \
    tini \
    && curl -L -o /bitcoin.tar.gz ${BTC_URL} \
    && tar -xzvf /bitcoin.tar.gz \
    && mkdir /root/.bitcoin \
    && apk del curl ca-certificates \
    && mv /bitcoin-*/bin/* /usr/local/bin/ \
    && rm -rf /bitcoin-*

# EXPOSE 8332 8333 18332 18333
ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "/docker-entrypoint.sh"]