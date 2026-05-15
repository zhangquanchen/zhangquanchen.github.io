source "https://rubygems.org"

# 本地用 Jekyll 4 直接构建（GitHub Pages 服务器端仍用 github-pages gem 自动构建，
# 我们的模板在 Jekyll 3.9 / 4.x 渲染结果一致）。
gem "jekyll", "~> 4.3"

# Ruby 3.0+ 将 webrick 移出标准库，jekyll serve 需要显式添加
gem "webrick"

# Ruby 3.4+ 将以下原标准库移出 default gems
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"

gem "wdm", "~> 0.1.0" if Gem.win_platform?

# Plugins enabled at build time
group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-gist"
  gem "jekyll-redirect-from"
  gem "jekyll-paginate"
end
