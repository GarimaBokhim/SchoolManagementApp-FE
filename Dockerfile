FROM node:18-bullseye

WORKDIR /src

# Enable pnpm
RUN corepack enable

# Copy only dependency files first
COPY package.json pnpm-lock.yaml ./

# Install deps (ensures SWC optional deps install)
RUN pnpm install

# Copy rest of the app
COPY . .

CMD ["pnpm", "dev"]
