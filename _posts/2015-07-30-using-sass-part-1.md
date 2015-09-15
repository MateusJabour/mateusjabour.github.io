---
layout: posts
title: "Using Sass - PART 1"
summary: "Sass is the most mature, stable, and powerful professional grade CSS extension language in the world. This post will teach how to use it in your project, let's get start?"
homeImage: "/assets/img/sass-part1-icon.jpg"
type: post
permalink: using-sass-part-1
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Sass Logo]({{ page.homeImage }})

First of all, you need to know the only prerequisite to read this post, you need to know CSS, because Sass is a extension of CSS, easier to write and with more utilities.

There are two types of Sass files: .scss and .sass. They are different, and a I will talk about both on this post. On this part 1 we are going to talk about the .scss files.

So, let's start with the basic part of Sass. Sass gives us a new way to comment your file, by using "//" instead of "/**/", but remember that when you compile Sass into CSS, the commentaries with "//" will not appear on the CSS file.

The best way of working with Sass is creating a "style.sass", that will be the main file, then, you create a lot of **partials** and import them into de style.sass, this will compile into a single CSS file. But now you are going to ask me, what is a partial? And I answer you, partial a Sass file that the name starts with underscore, if you don't use partial, you're going to have a lot of CSS files compiled, and I think you don't want this.

In Sass, you can nest selectors, see the example below:

`
.content {
    float: left;
    h2 {
        font-family: Arial;
    }
    p {
        font-family: sans-serif;
    }
}
`

Instead of doing ".content h2" and ".content p", we can nest the selectors and have less lines of code.

You can nest properties too:

`
.content {
    text: {
        decoration: none;
        align: center;
    }
}
`
When you are nesting selector, you can refer to the selector mother using "&":

`
a {
    color: #000;
    &:hover {
        color: #fff;
    }
}
`

Creating variables in Sass is easy, just using "$" before a word and giving the value:

`
$color: #000;
a {
    color: $color;
}
`

If you use the flag "!default" on a variable, this will be the default value until other variable is created.

`
$color: #000 !default;
$color: #fff;
a {
    color: $color;
}
`
In this case, the #fff color is used, because it overwrite the default value. About scope, scope on Sass is of block, look on the example below:

`
$color: #000;
a {
    color: $color;
    &:hover {
        $color: #fff;
        color: $color;
    }
}
`
The value of $color is globally setted as #000, but insite "a:hover" it is setted as #fff, that will change value of $color. Look other situation of scope below:

`
h2 {
    $color: #000;
}
p {
    color: $color;
}
`

In this case, $color isn't valid on "p", just on "h2", because the variable was created on that block.

You can use variables on properties name, but you need to use a thing called interpolation:

<code>
$side: top;
<br>
$prop: text;
.#{$prop} {
    #{$side}: 10px;
}
</code>

On Sass we have a good tool, called "mixins", mixin is a couple of code that you can use only by using "@include" and the name of the mixin. Creating and using mixins is easy:

<code>
@mixin button($color: black) {
    border-bottom: 2px solid $color;
}
<br>
.btn-01 {
    @include button(white);
}
</code>

We can pass arguments to a mixin too, and set a default value to each argument, in this case, you see that the default was "black", it means that if I didn't pass the "white" as the value of my argument, the value would be "black". If you use '...' on a argument($var...), you can pass a lot of values. You can use interpolation on mixin:

<code>
@mixin button($side, $value) {
    #{$side}: $value;
}
</code>

Extends is different from mixins, extends join selectors in one block, the best way of understandind extends is see the comparison between the Sass and CSS:

<code>
 In Sass:
.content {
    border: 1px solid #ccc;
    padding: 20px;
    h2 {
        font-size: 3em;
        margin: 20px 0;
    }
}
.callout {
    @extend .content;
    background: #ddd;
}
<br>
In CSS:
.content,
.callout {
    border: 1px solid #ccc;
    padding: 20px;
}
.content h2,
.callout h2 {
    font-size: 3em;
    margin: 20px 0;
}
.callout {
    background: #ddd;
}
</code>

So, you can see that extends apply the same style to a selector, already applied to other. There is a problem in this example, because, every modification into the selector you used to extend other, will be applied to the extended selector, like this:

<code>
.btn-a {
    border: 1px;
}
<br>
.btn-b {
    @extend .btn-a;
}
<br>
.sidebar .btn-a {
    border: 2px;
}
</code>

This will create a ".sidebar. btn-a {border: 2px;}" too, but don't desparate, there is a better way to use extends, by using placeholders, using a "%" and a name:

<code>
%btn {
    background: #777;
    border: 1px solid #ccc;
    font-size: 1em;
    text-transform: uppercase;
}
<br>
.btn-a {
    @extend %btn;
}
<br>
.btn-b {
@extend %btn;
    background: #ff0;
}
<br>
.sidebar .btn-a {
    text-transform: lowercase;
}
</code>

This way will not bring us problem. Let's talk about function in Sass, you can create function like in others languages, and the arguments works the same as the mixin's arguments

<code>
@function name ($arguments) {
    @return something;
}
</code>

In Sass we have control statments, like if, while, for and each. Let's start with the simple one, the "if":

<code>
$theme: dark;
header {
    @if $theme == dark {
    background: #000;
    }
}
</code>

Easy, no? Looks the same as others languages, so, let's move on to the "for" and "while", that looks almost the same:

<code>
.item {
    position: absolute;
    right: 0;
        for $i from 1 through 3 {
        &.item-#{$i} {
            top: $i * 30px;
        }
    }
}
<br>
.item {
    position: absolute;
    right: 0;
    @while $i < 4 {
        &.item-#{$i} {
            top: $i * 30px;
        }
        $i: $i + 1;
    }
}
</code>

The only difference between these two is the control of the "i" variable, on the while statment you can change how much do you want to increase the i value.

And at last, the each statment, that interate on a list:

<code>
$authors: nick aimee dan drew;
<br>
@each $author in $authors {
    .author-#{$author} {
        background: url(author-#{$author}.jpg);
    }
}
</code>

This will make a class for each author, and it will use the appropriate picture. So, after learning how to use mixins, functions and extends, let's learn WHEN to use them.

`
๏ Mixins
Similar sets of properties used
multiple times with small variations
๏ Extend 
Sets of properties that match 
exactly
๏ Functions
Commonly-used operations to
determine values
`

Sass supports basics arithmetical operations, and it has a lot of functions that can help us on details:

-  **round($number)** - round to closest whole number
-  **ceil($number)** - round up
-  **floor($number)** - round down
-  **abs($number)** - absolute value
-  **min($list)** - minimum list value
-  **max($list)** - maximum list value
-  **percentage($number)** - convert to percentag

Talking about color, you can involve hexadecimal into arithmetical operations, and you can use hexadecimal on rgba(), just by passing the hex and the alpha value:

<code>
//using arithmetic of hexadecimal
$color1: #222
$color2: #333
<br>
h1 {
    color: $color1 + $color2;//#555 is the value
}
</code>
<code>
//rgba()
h1 {
    color: rgba(#555, .5);
}
</code>

Next, look some functions involving color, that can be very useful if you don't want to search for a color always.

- **lighten($color, $amount)**
- **darken($color, $amount)**
- **saturate($color, $amount)**
- **desaturate($color, $amount)**
- **grayscale($color)**
- **invert($color)**
- **complement($color)**

Now, we're going to talk about media query, what is it? A media query consists of a media type and at least one expression that limits the style sheets' scope by using media features, the basic construction of them is:

<code>
.sidebar {
border: 1px solid #ccc;
}
<br>
@media (min-width: 700px) {
    .sidebar {
        float: right;
        width: 30%;
    }
}
</code>

But Sass let you nest this media query on the selector:

<code>
.sidebar {
    border: 1px solid #ccc;
    @media (min-width: 700px) {
        float: right;
        width: 30%;
    }
}
</code>

Sass facilitate your life more with the "respond-to" mixin, that simply allow you to create a media query calling a mixin with 2 arguments, one is the type, and other the size.

<code>
@mixin respond-to ($type, $query) {
    @media ($type: $query) {
        @content;
    }
}
</code>

And content will receive all that is inside the mixin:

<code>
.sidebar {
    border: 1px solid #ccc;
    @include respond-to(max-width, 600px){
        float: left;//content
        width: 30%;//content
    }
}
</code>

And Sass allows you to use one "@media" for two selectors:

<code>
@media (min-width: 700px) {
    .sidebar {
         width: 50%;
     }
    .callout {
         width: 35%;
     }
}
</code>

{% for author in site.data.author%}
So, we finished part 1 of this post, the part 2 will talk about the .sass files, the syntax and the utilities it has. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any doubts with the tutorial, contact me. See you in the next post. :D
{% endfor %}