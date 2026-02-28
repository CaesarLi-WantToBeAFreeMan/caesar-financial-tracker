# Caesar Financial Tracker

Personal financial management system built with `Spring Boot` and `React`

## Author

**Caesar James LEE**

## Features

1. sort records by:
    - `date`
    - `price`
    - `name`
    - `keyword`
    - `category`
    - `type`
2. filter and search records dynamically
3. import multiple records using:
    - `CSV`
    - `TSV`
    - `Excel`
    - `JSON`
4. export all records in:
    - `CSV`
    - `TSV`
    - `Excel`
    - `JSON`
5. summary charts powered by `recharts`
6. view statistics by:
    - `date`
    - `price`
    - `type`
    - `category`
7. interactive tooltips and responsive charts

## Version History

|   version   |    status    |                 stack                  |       description        |
| :---------: | :----------: | :------------------------------------: | :----------------------: |
| `alpha.1.0` | `developing` | `Spring Boot` + `React` + `TypeScript` | `first released version` |

## License

This project is licensed under the [`MIT` License](./LICENSE)

## Technology Stack

### Backend

#### Components

|    Component     |  Version  |
| :--------------: | :-------: |
|      `Java`      | `21.0.9`  |
|     `Maven`      | `3.9.12`  |
|  `Spring Boot`   |  `4.0.1`  |
|     `Lombok`     | `1.18.42` |
| `JSON Web Token` | `0.13.0`  |
|   `Apache POI`   |  `5.5.1`  |
|    `OpenCSV`     | `5.12.0`  |

#### Features

- `RESTful` API architecture
- `JWT-based` authentication
- `CSR` (Controller-Service-Repository) pattern
- file import/export handling
- secure data validation

### Frontend

#### Components

|     Component     |  Version  |
| :---------------: | :-------: |
|     `Node.js`     | `24.11.1` |
|   `TypeScript`    |  `5.9.3`  |
|      `Vite`       |  `7.2.4`  |
|      `React`      | `19.2.0`  |
|  `React Router`   | `7.11.0`  |
|      `Axios`      | `1.13.2`  |
|  `Tailwind CSS`   | `4.1.18`  |
|  `Emoji Picker`   | `4.17.4`  |
|  `Lucide Icons`   | `0.562.0` |
| `React Hot Toast` |  `2.6.0`  |
|    `Recharts`     |  `3.7.0`  |

#### Features

- fully typed with `TypeScript`
- responsive UI with `Tailwind CSS`
- dynamic charts and analytics
- modular component architecture
- `axios-based` API integration
- modern `Vite` build system

### Database

| Component | Version |
| :-------: | :-----: |
|  `MySQL`  |  `8.4`  |

## Getting Started

```bash
    cd backend; mvn clean install spring-boot:run; cd ../frontend;npm install run dev
```

## Improvements To DO List

- [ ] `cim#1`: support `oauth2` login
- [ ] `cim#2`: support dark/light toggle
- [ ] `cim#3`: support `i18n`
- [ ] `cim#4`: support custom date/price format rules
- [ ] `cim#5`: track records from third party apps (`Paypal`/`credit card`/`debit card`...)
- [ ] `cim#6`: use email to activate account
- [ ] `cim#7`: report to email
- [ ] `cim#8`: use `cloudflare` to accelerate/secure web
- [ ] `cim#9`: use `CI/CD` to test automatically
- [ ] `cim#10`: use `react native` to build `Android` & `iOS` apps
