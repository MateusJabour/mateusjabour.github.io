---
layout: posts
title: "Installing Ruby in your Windows environment"
summary: "Ruby is a dynamic, reflective, object-oriented, general-purpose programming language. This post is about how to install Ruby in your windows, it's easy, so let's get it on."
homeImage: "/assets/img/installing-ruby-on-windows.png"
type: post
permalink: installing-ruby-on-windows
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Ruby Logo]({{ page.homeImage }})

Hi, I'm here to help you to install ruby in windows. It is very simple, click on this link: <a href="http://rubyinstaller.org/downloads/" target="_blank">Installer</a>

We are going to download the Rubyinstaller and the Development Kit, so we can get the RubyGems and have the best Ruby environment. But you can look that the DevKit just supports the 2.0.0 version, obviously this will be the version you will download.

After downloading and installing the two things, you open the command prompt for configure the DevKit. Write the following commands: 

```
chdir C:\DevKit
ruby dk.rb init
ruby dk.rb install
```

{% for author in site.data.author%}
And now, you can finally start to programe in Ruby. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any doubts with the installation, contact me :)
{% endfor %}