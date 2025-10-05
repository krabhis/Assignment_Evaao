#  Quick Setup Guide

## Prerequisites

- Expressjs
- React js
- MongoDB (local or Atlas)

## Quick Start

### 1. Backend Setup

```bash
cd Backened
npm install
```
```

Start backend:

```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd Frontened
npm install
```

Start frontend:

```bash
npm run dev
```

### 3. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/expenses


### Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/expense-tracker`



## Troubleshooting

- **Backend won't start**: Check MongoDB connection
- **Frontend can't connect**: Ensure backend is running on port 5001


## Features

+ Add/Edit/Delete expenses
+ Category filtering
+ Date range filtering
+ Summary reports
+ Import/Export data
+ MongoDB persistence
+ Simple UI design
