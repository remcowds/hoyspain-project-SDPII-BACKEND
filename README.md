# 2022-backend-aalst3

2022-backend-aalst3 created by GitHub Classroom

## Project setup

1. Zorg ervoor dat NodeJS (& MySQL) is geïnstalleerd.
2. Clone de repository
3. Open de terminal
4. Installeer packages: `yarn`
5. Maak .env file in de root map
6. Start de server: `yarn start`

### ENV uitleg

##### Development

-   creëert lokale databank met naam 'DEVHoySpain' (zie config/development)
    -   voorlopig nog lege db (geen migrations / seeds)
-   de .env zal er zo uitzien:
    ```
    NODE_ENV=development
    DATABASE_USER="[username]"
    DATABASE_PASSWORD="[ww]"
    Email_api_key = [email-waarvan-je-mails-verzend]
    FIREBASE_PROJECT_ID = [fb-id]
    FIREBASE_CLIENT_EMAIL = [fb-mail]
    FIREBASE_PRIVATE_KEY = [fb-pk]
    ```

#### Production

-   connecteert met db met naam 'MnvyNkjdYH' (zie config/production) op de online server
    -   voorlopig nog leeg
-   de .env zal er zo uitzien:
    ```
    NODE_ENV=production
    DATABASE_USER=[db-user]
    DATABASE_PASSWORD=[db-ww]
    DATABASE_NAME=[db-name]
    DATABASE_HOST= [link-to-host]
    Email_api_key = [email-waarvan-je-mails-verzend]
    FIREBASE_PROJECT_ID = [fb-id]
    FIREBASE_CLIENT_EMAIL = [fb-mail]
    FIREBASE_PRIVATE_KEY = [fb-pk]
    
    ```
