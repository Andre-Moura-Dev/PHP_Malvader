services:
  mysql:
    image: mysql:8.0
    container_name: malvader_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: banco_malvader
      MYSQL_USER: 'root'
      MYSQL_PASSWORD: 'PYTHON66@java'
    ports:
      - "3307:3306"
    volumes:
      - db_data:/var/lib/mysql

  php:
    build:
      context: .
      dockerfile: ./Dockerfile.backend
    container_name: malvader_php
    depends_on:
      - mysql
    ports:
      - "8080:80"
    volumes:
      - ./src/backend:/var/www/html

  frontend:
    build:
      context: ./src
      dockerfile: ./Dockerfile.frontend
    container_name: malvader_frontend
    ports:
      - "3000:3000"
    depends_on:
      - php
    environment:
      NEXT_PUBLIC_API_URL: "http://localhost:8080"
    volumes:
      - ./:/var/www/front


volumes:
  db_data:
    driver: local