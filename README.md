# TODO 3.0 - Next.js + MERN + Blockchain

React project টা Next.js + MERN + Ethereum দিয়ে পুরো convert করা হয়েছে।

## 📁 Project Structure

```
todo3-nextjs/
├── backend/                  ← Express + MongoDB + Web3 (MERN backend)
│   ├── config/db.js          ← MongoDB connection
│   ├── contract/contract.js  ← Web3 blockchain connection
│   ├── controllers/          ← Business logic
│   ├── model/
│   │   ├── TaskLog.js        ← MongoDB Mongoose model (MERN)
│   │   └── tasks.js          ← Blockchain validation helpers
│   ├── routes/routes.js      ← Express routes
│   ├── server.js             ← Entry point
│   ├── ABI.json              ← Ethereum contract ABI
│   └── .env.example          ← Environment variables
│
├── frontend/                 ← Next.js 14 App Router
│   └── src/
│       ├── app/
│       │   ├── layout.js         ← Root layout with Web3Provider
│       │   ├── page.js           ← Wallet connect page
│       │   ├── view-all-tasks/   ← All tasks from blockchain
│       │   ├── create-task/      ← Create task on blockchain
│       │   ├── view-task/        ← View single task
│       │   ├── update-task/      ← Update task on blockchain
│       │   ├── delete-task/      ← Delete task from blockchain
│       │   └── task-logs/        ← MongoDB history (MERN part)
│       ├── components/
│       │   ├── Navigation.js     ← Navbar with active link
│       │   └── Modal.js          ← Reusable modal
│       ├── context/
│       │   └── Web3Context.js    ← Global wallet/contract state
│       └── lib/
│           └── ABI.json          ← Contract ABI (frontend copy)
│
└── task.sol                  ← Solidity smart contract
```

## 🚀 Setup Instructions

### Step 1: Backend Setup

```bash
cd backend
cp .env.example .env
# .env file edit koro:
# MONGODB_URI=mongodb://localhost:27017/todo3
# WEB3_PROVIDER=YOUR_QUICKNODE_OR_INFURA_URL
# CONTRACT_ADDRESS=0x795e47574f11055806e294f1b95090cd46ececdd

npm install
npm run dev
# Server chalbe: http://localhost:5000
```

### Step 2: Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
# NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

npm install
npm run dev
# App chalbe: http://localhost:3000
```

### Step 3: MetaMask Setup

1. MetaMask install koro browser e
2. Sepolia testnet select koro
3. App e giye "Connect MetaMask" click koro

## 🔗 API Endpoints (Backend)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ethereum/create-task` | Date clash check + MongoDB log |
| POST | `/api/ethereum/update-task` | Date clash check + MongoDB log |
| DELETE | `/api/ethereum/delete-task/:id` | Priority check + MongoDB log |
| GET | `/api/ethereum/view-task/:id` | Blockchain theke single task |
| GET | `/api/ethereum/view-all-task` | Blockchain theke all tasks |
| GET | `/api/ethereum/task-logs` | MongoDB history logs |

## ⛓️ Blockchain Flow

```
User Action
    ↓
Next.js Page (frontend)
    ↓
Express Backend (date clash / priority check)
    ↓
MongoDB log save (MERN)
    ↓
MetaMask transaction sign
    ↓
Ethereum Smart Contract (Sepolia)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Web3.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose (MERN)
- **Blockchain**: Ethereum (Sepolia Testnet), Solidity, Web3.js
- **Wallet**: MetaMask
