#!/bin/bash
# 使用 Docker 本地预览，无需安装 Ruby 依赖
# 需要先安装 Docker: https://www.docker.com/products/docker-desktop

# 构建自定义镜像（包含 ffi 等 gem 所需的编译依赖）
docker build -t jekyll-pages-local .

docker run --rm -p 4000:4000 \
  -v "$(pwd):/srv/jekyll" \
  -v "$(pwd)/.bundle:/usr/local/bundle" \
  -e JEKYLL_ENV=development \
  jekyll-pages-local \
  bash -c "bundle install && bundle exec jekyll serve --host 0.0.0.0 --livereload"
