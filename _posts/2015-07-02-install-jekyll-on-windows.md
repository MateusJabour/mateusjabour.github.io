---
layout: posts
title: "Installing Jekyll in your Windows environment"
summary: "Jekyll is a RubyGem that offers you a way of transforming your HTML/CSS into a static website. This post is about how to install and use Jekyll, let's move on."
homeImage: "/assets/img/installing-jekyll-on-windows.png"
type: post
permalink: installing-jekyll-on-windows
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Jekyll Logo]({{ page.homeImage }})

First of all, if you haven't installed Ruby in your system, I have already taught how to do it, follows the post's link: <a href="/installing-ruby-on-windows">Ruby</a>

Hi, I'm here to help you to install Jekyll in windows. It is very simple. First go to your command prompt and write this command: 

`
gem update --system
`

This will update the RubyGem for you, after the process is finished, let's install the Jekyll, write the following commands on the prompt:

`
gem install jekyll
`

Now, you have Jekyll installed, using it is simple, just go to the directory you want to create a server and do it, see the following exemple: 

`
jekyll new my-awesome-site 
cd my-awesome-site 
jekyll serve 
`
Jekyll offers you a way to transform your static website into a dynamic one, since it's a simple, blog-aware, static site generator.

{% for author in site.data.author %}
I created a directory with the Jekyll using "new", then I used "cd" to go to this directory, and when I was inside, I used "serve" to create a local server.
And now, you can finally start your website and use a local server for tests. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any doubts with the installation, contact me :)  
{% endfor %}
