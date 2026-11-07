# MẪU Dockerfile cho frontend/ (Next standalone). Cần `output: "standalone"` trong next.config.ts.
# Đặt thành frontend/Dockerfile. Ghim đúng bản Node đang dùng ở dev.
FROM node:22.23.0-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.23.0-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Lúc build KHÔNG có CMS: để CMS_API_URL trống -> generateStaticParams dùng mock / rỗng,
# trang chi tiết được dựng khi có người mở lần đầu (dynamicParams = true) rồi cache lại.
RUN npm run build

FROM node:22.23.0-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN groupadd --system --gid 1000 app && useradd --system --uid 1000 --gid app app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/messages ./messages
RUN mkdir -p .next/cache && chown -R app:app .next/cache
USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]
