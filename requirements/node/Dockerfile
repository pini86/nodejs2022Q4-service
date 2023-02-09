FROM node:18-alpine3.14
ENV TZ Europe/Moscow
STOPSIGNAL SIGKILL
WORKDIR /app
CMD	\
	npm ci && \
	npm run start:dev && \
	echo
