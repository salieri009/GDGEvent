#!/bin/bash
set -e

# ── 설정 (환경 변수로 주입) ───────────────────────────────────────────
: "${PROJECT_ID:?Set PROJECT_ID}"
: "${SUPABASE_URL:?Set SUPABASE_URL}"
REGION="${REGION:-asia-northeast3}"          # 서울
REPO="${REPO:-gdg-repo}"
# ─────────────────────────────────────────────────────────────────────

REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}"
API_IMAGE="${REGISTRY}/api"
WEB_IMAGE="${REGISTRY}/web"
BACKEND_ENV_VARS="SUPABASE_URL=${SUPABASE_URL},NODE_ENV=production,PORT=4000"
BACKEND_SECRET_ARGS=()

if [ -n "${SUPABASE_SERVICE_ROLE_KEY_SECRET:-}" ]; then
  BACKEND_SECRET_ARGS=(--set-secrets "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY_SECRET}:latest")
else
  : "${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY_SECRET}"
  BACKEND_ENV_VARS="${BACKEND_ENV_VARS},SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}"
fi

echo "==> [1/5] Docker 인증"
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo "==> [2/5] Backend 이미지 빌드 & 푸시"
docker build --platform linux/amd64 -t "${API_IMAGE}" ./src/backend
docker push "${API_IMAGE}"

echo "==> [3/5] Backend Cloud Run 배포"
gcloud run deploy api \
  --image "${API_IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 4000 \
  --set-env-vars "${BACKEND_ENV_VARS}" \
  "${BACKEND_SECRET_ARGS[@]}" \
  --quiet

BACKEND_URL=$(gcloud run services describe api \
  --region "${REGION}" \
  --format "value(status.url)")
echo "Backend URL: ${BACKEND_URL}"

echo "==> [4/5] Frontend 이미지 빌드 & 푸시"
docker build --platform linux/amd64 -t "${WEB_IMAGE}" ./src/frontend
docker push "${WEB_IMAGE}"

echo "==> [5/5] Frontend Cloud Run 배포"
gcloud run deploy web \
  --image "${WEB_IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 80 \
  --set-env-vars "BACKEND_URL=${BACKEND_URL}" \
  --quiet

FRONTEND_URL=$(gcloud run services describe web \
  --region "${REGION}" \
  --format "value(status.url)")

echo ""
echo "✅ 배포 완료!"
echo "   Frontend : ${FRONTEND_URL}"
echo "   Backend  : ${BACKEND_URL}"
