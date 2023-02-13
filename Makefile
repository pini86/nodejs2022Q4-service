start:
		docker-compose up

stop:
		docker-compose down

migration:
		docker-compose exec node npm run migration:up

migration-down:
		docker-compose exec node npm run migration:down

migration-gen:
		docker-compose exec node npm run migration:gen migrations/${NAME}

db-drop:
		docker-compose exec node npm run db:drop

clean:
		docker-compose down --rmi local -v

fclean: clean
		docker rmi node:rss 2>/dev/null || true
		docker rmi postgres:rss 2>/dev/null || true

test:
		docker-compose exec node npm run test

help:
		@echo "Usage: make [target] ..."
		@echo "  start            - start docker containers"
		@echo "  stop             - stop and remove docker containers"
		@echo "  test             - run application tests"
		@echo
		@echo "Cleaning"
		@echo "  clean            - Warning: stop and remove containers, network, DB data volume"
		@echo "  fclean           - Warning: clean + remove docker images"
		@echo

.PHONY: all help run start stop migration migration-down migration-gen db-drop clean fclean re test