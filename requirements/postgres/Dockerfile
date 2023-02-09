FROM postgres:alpine3.16
ENV TZ Europe/Moscow
STOPSIGNAL SIGINT
EXPOSE 5432
CMD ["postgres", "-c", "logging_collector=on", "-c", "log_statement=mod"]
