---
layout: posts
title: "Using Sass - PART 2"
summary: "Sass is the most mature, stable, and powerful professional grade CSS extension language in the world. This post is the continuation of the 'Using Sass - PART 1' post, so let's continue."
homeImage: "/assets/img/sass-part2-icon.jpg"
type: post
permalink: using-sass-part-2
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Sass Logo]({{ page.homeImage }})

Now, we will talk about the .sass file, what is the difference betweet this sort of file and the one we've seen on the first part? The .sass files syntax is indented, without the necessity of "{}" and ";". Other difference is that you create mixins with "=" and use them with "+": 

<code>
=padding($size)
  padding: $size
<br>
.content
  +padding(20px)
</code>

List's items can be separated with comma or spaces, and Sass gives us a lot of function to work with lists:

-   **length($list)** ---> number of items.
-   **append($list, $value)** ---> add one item on the final of the list.
-   **join($list1, $list2)** ---> join two lists.
-   **index($list, $value)** ---> return the position value
-   **nth($list, $n)** ---> return the item value of the position that has been passed as argument.
-   **zip($lists...)** ---> create lists inside one list.

The is only one color function in .sass, but, the arguments change it result:

- scale-color($color, [$red], [$green], [$blue], [$saturation], [$lightness], [$lightness])

You can use one of them to change the color you pass, just doing: "$green: 20%".

On .sass files, there is a shorter way of using the "if" statment:

<code>
if($condition, $if-true, $if-false)
<br>
example:
    background: if($theme == dark, #000, #fff)
</code>

And other thing that .sass allows is to put a class with a placeholder:

<code>
%btn
.btn
  border: 2px solid black
  b
    color: white
</code>

{% for author in site.data.author%}
So this is it, this part 2 is very simple, just to give you the difference between the two types of files. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any dought with the tutorial, contact me.
{% endfor %}