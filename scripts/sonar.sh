#!/bin/sh
# SonarQube 本地扫描：读取 SONAR_HOST_URL / SONAR_TOKEN →（运行测试生成覆盖率）→ 上传到 $SONAR_HOST_URL
# 变量读取顺序（后者覆盖前者）：~/.config/sonarqube/env → ./.env.sonar → 已有的环境变量
# 版本号取当前提交短 SHA：新代码基线 = 上一次扫描的提交，建议 commit 之后再扫描。
set -e
cd "$(dirname "$0")/.."

_preset_token="${SONAR_TOKEN:-}"
_preset_url="${SONAR_HOST_URL:-}"
for f in "$HOME/.config/sonarqube/env" ./.env.sonar; do
  if [ -f "$f" ]; then set -a; . "$f"; set +a; fi
done
[ -n "$_preset_token" ] && SONAR_TOKEN="$_preset_token"
[ -n "$_preset_url" ] && SONAR_HOST_URL="$_preset_url"
if [ -z "${SONAR_HOST_URL:-}" ]; then
  echo "SONAR_HOST_URL 未设置：请写入 ~/.config/sonarqube/env（或本仓库的 .env.sonar）" >&2
  exit 1
fi
if [ -z "${SONAR_TOKEN:-}" ]; then
  echo "SONAR_TOKEN 未设置：请写入 ~/.config/sonarqube/env（或本仓库的 .env.sonar）" >&2
  exit 1
fi
export SONAR_TOKEN SONAR_HOST_URL

EXTRA=""
npx c8 --reporter=lcov --reporter=text-summary mocha

# shellcheck disable=SC2086
npx --yes @sonar/scan@5 -Dsonar.host.url="$SONAR_HOST_URL" -Dsonar.projectVersion="$(git rev-parse --short HEAD)" $EXTRA
