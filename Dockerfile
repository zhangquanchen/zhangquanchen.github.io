# 基于 jekyll/jekyll:pages，添加 ffi 等 gem 所需的编译依赖
FROM jekyll/jekyll:pages

# 安装构建工具和 libffi，ffi gem 编译原生扩展时需要
USER root
RUN apk add --no-cache build-base libffi-dev && \
    chown -R jekyll:jekyll /usr/gem
USER jekyll
