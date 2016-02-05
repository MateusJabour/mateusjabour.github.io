---
layout: posts
title: "Compiling Sass"
summary: "Sass is the most mature, stable, and powerful professional grade CSS extension language in the world. This post will teach you how to compile your Sass project on a css file"
homeImage: "/assets/img/sass-icon.png"
type: post
permalink: compiling-sass
---
<h2 class="post__text-title">{{ page.title }}</h2>

![Sass Logo]({{ page.homeImage }})

After learning how to write Sass files, you're going to understand how we compile these files into a single CSS file. If you didn't read the posts that teach how to code on Sass, you can go there write now, just by clicking on the following links:

-   <a href="/using-sass-part-1" target="_blank">Using sass - PART 1</a> 
-   <a href="/using-sass-part-2" target="_blank">Using sass - PART 2</a>

Ok, now we can start. We have to ways of compiling our Sass files, with the Sass compiler and with the Compass. First let's see how we use the Sass compiler.

The **Sass Compiler** is a RubyGem, so you need to install Ruby if you're using Windows, I posted how to do it, just click on the following post if you didn't read that one too: <a href="/installing-ruby-on-windows" target="_blank">Installing Ruby on Windows</a>.

After installing it, go to your command prompt and use the following command:

`
gem install sass
`

This will install the gem you need, and it is ready to use, to compile a file Sass, go to the directory of the file and use this:

`
sass [name of the file]
`

If you want to give a path to the output CSS file, stay at the directory of the Sass file, and use this command:

`
sass [name of the file]:[path and name of the CSS file]
`
A good tool is the "--watch", that will see every change on the Sass file and compile automatically to the CSS file, you can use the two types of command with "--watch":

<code>
WITHOUT PATH:
sass --watch [name of the file]
<br>
WITH PATH:
sass --watch [name of the file]:[path and name of the CSS file]
</code>

This is how we compile Sass into CSS using the Sass compiler, now, let's use Compass to do it, first you need to install it:

`
gem install compass
`

A good thing in Compass is that you can create a file called "config.rb" with all the configuration you want, the example below is the file I use to this website:

`
preferred_syntax = :sass
http_path = '/'
css_dir = 'assets/css'
sass_dir = 'assets/sass'
images_dir = 'assets/img'
relative_assets = true
line_comments = true
`

You can notice that automatically Compass will know where is everything: CSS, Sass and Images directory. So using tha following command:

`
compass watch
`

You will compile the Sass file into the CSS file, and every change on Sass file will be compiled. Remember that you need to be on the directory of the "config.rb"(that should be on your project directory) to use this command.

{% for author in site.data.author%}
So, these are the two ways to compile Sass into CSS. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any doubts with the compiling, contact me :)
{% endfor %}