рекомендации - добавления индексов на поля username, phone_number, google_id, apple_id и email, если планируете часто выполнять запросы по этим полям.
CREATE TABLE Users (
user_id SERIAL PRIMARY KEY,
username VARCHAR(50) NOT NULL,
phone_code
password_hash VARCHAR(255), -- Поле для пароля может быть пустым, если используется только Google/Apple OAuth
phone_number VARCHAR(20) UNIQUE, -- Только если телефон используется для регистрации
google_id VARCHAR(255) UNIQUE, -- Идентификатор пользователя Google
apple_id VARCHAR(255) UNIQUE, -- Идентификатор пользователя Apple (iCloud)
email VARCHAR(255) UNIQUE, -- Электронная почта, может быть нужна для подтверждения
provider VARCHAR(50) DEFAULT NULL, -- Хранит информацию о том, через какой сервис был произведен вход (Google, Apple, Phone)
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RefreshTokens (
token_id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES
Users(user_id) ON DELETE CASCADE,
refresh_token VARCHAR(255) UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
expires_at TIMESTAMP NOT NULL
);

CREATE TABLE Sessions (
session_id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
ip_address VARCHAR(45) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
expires_at TIMESTAMP NOT NULL
);

CREATE TABLE VPN_Servers (
server_id SERIAL PRIMARY KEY,
server_name VARCHAR(100) NOT NULL,
location VARCHAR(100) NOT NULL,
protocol VARCHAR(50) NOT NULL
);

CREATE TABLE Connections (
connection_id SERIAL PRIMARY KEY,
session_id INTEGER REFERENCES Sessions(session_id) ON DELETE CASCADE,
server_id INTEGER REFERENCES VPN_Servers(server_id) ON DELETE CASCADE,
start_time TIMESTAMP NOT NULL,
end_time TIMESTAMP
);

CREATE TABLE Logs (
log_id SERIAL PRIMARY KEY,
connection_id INTEGER REFERENCES Connections(connection_id) ON DELETE CASCADE,
log_message TEXT NOT NULL,
timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE VerificationCodes (
code_id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES Users(user_id) ON DELETE CASCADE,
verification_code VARCHAR(6) NOT NULL,
expires_at TIMESTAMP NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

http://localhost:3000/
секрет клиента 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
ид клиента 852601239920-7sdtvvm3ghqfkqn3ib2asf9h6qj5kkb6
https://maxpfrontend.ru/vebinary/avtorizatsiya-s-pomoschyu-google-sign-in/
