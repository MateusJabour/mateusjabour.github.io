preferred_syntax = :sass
http_path = '/'
css_dir = 'assets/css/dev'
sass_dir = 'assets/sass'
images_dir = 'assets/img'
relative_assets = true

output_style = :expanded
line_comments = true

on_stylesheet_saved do
  `compass compile -c config_dev.rb --force`
end