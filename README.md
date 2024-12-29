# ERC 4337 Implementation

## Contracts Setup

### Initialize Submodules

```bash
git submodule update --init --recursive
```

```bash
cd contracts/lib/account-abstraction
git checkout releases/v0.7
cd ../..
```

### Setup .env

```bash
cp .env.exemple .env
```

- Private key
- Entrypoint
- RPC URL
- Arbitrum Sepolia API key

### Deploy Contracts

```bash
source factory.sh
source paymaster.sh
```

### Deployed Contracts

#### Factory

[0x89b5bF1ce7657B3caC45938Ade3a2e97bBe214E7](https://sepolia.arbiscan.io/address/0x89b5bF1ce7657B3caC45938Ade3a2e97bBe214E7)

#### Paymaster

[0x10Fa4C0fe7a48B7d5372Cb84651AA90E5BEB8E88](https://sepolia.arbiscan.io/address/0x10Fa4C0fe7a48B7d5372Cb84651AA90E5BEB8E88)

### Bundler Setup

I used [Alchemy Rundle](https://docs.alchemy.com/reference/bundler-api-quickstart) to bundle transactions.

## Frontend Setup

### Setup .env

```bash
cp .env.exemple .env.local
```

- Relayer Private Key: Private key of the account that will be used to deploy the smart account.
- Bundler API: Alchemy Bundler API key.
- Price API Key: API key from cryptocompare.

### Install and Run the frontend

```bash
npm install
npm run dev
```
