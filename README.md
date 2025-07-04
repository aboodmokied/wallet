# 💳 Online Wallet

An online financial system that allows users to perform transactions such as transferring money, making payments to companies, and charging their wallet through authorized charging points.

## 🚀 Features

- 🔁 **Transfer**: Send money from one user to another
- 💵 **Payment**: Pay companies using your wallet balance
- ⚡ **Charging**: Add funds to your wallet via charging points
- 🛡️ **Role-Based Access Control**: Different access levels for users, charging points, system owners, and admins

## 👥 User Roles

| Role           | Capabilities                                                                 |
|----------------|------------------------------------------------------------------------------|
| **User**       | Transfer funds, make payments to companies                                   |
| **Charging Point** | Charge money to users' wallets                                               |
| **System Owner**   | Monitor the system, create and manage charging points                        |
| **Admin**      | Manage the entire system, create system owners and other admins, manage roles |

## 🛠️ Tech Stack

- **Frontend**: React
- **Backend**: Express.js
- **Database**: MySQL

## 🔐 Authentication Routes

These are the main login endpoints for each role:

| Role              | HTTP Method | Endpoint                   | Description                  |
|-------------------|-------------|----------------------------|------------------------------|
| **User**          | `POST`      | `/login`     | Login for standard users     |
| **Charging Point**| `POST`      | `/login` | Login for charging points    |
| **Company**| `POST`      | `/login` | Login for companies    |
| **System Owner**  | `POST`      | `/cms/login`    | Login for system owners      |
| **Admin**         | `POST`      | `/web/auth/login/admin`    | Login for admin users        |

> ⚠️ **Important Note**: When registering a new user, make sure to use a **real Gmail account**. The system will send a **verification email** that must be confirmed before accessing your account.

## ⚙️ How To Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/aboodmokied/wallet.git
cd wallet
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Add Required Env Variables
create .env file in the root folder, fill it according to .env.example file.
### 4. Running
```bash
npm start
```
