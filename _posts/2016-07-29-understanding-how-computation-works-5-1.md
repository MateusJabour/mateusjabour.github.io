---
layout: posts
title: "Understanding how computation works part 5-1"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going to talk about a minimal programming language, called untyped lambda calculus."
homeImage: "/assets/img/understanding-how-computation-works-5-1.jpg"
type: post
permalink: understanding-how-computation-works-5-1
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

So, programming minimally consists in not taking advantage of many helpful features, like games, standard library, modules, methods, classes or objects. We will also try not to use control structures: assigments, arrays, strings, numbers and Booleans. The only 3 things we're going to use are:

- Referring to variables
- Creating procs
- Calling procs

Before we start to program in lambda calculus, we need to now how procs works, we have 4 subjects to discuss: plumbing, arguments, equality and syntax.

#### Plumbing

Procs are plumbing for moving values around programs. If I have:

<code>
 -> x { x + 2 }.call(1)
</code>

The argument value will flow into the block, and x will become 1, and this proc will return the result of 1 + 2, that's 4... Just kidding, 3, right? Basically procs make the values flow into the object where they're necessary.

#### Arguments

Like a function, procs can take more than 1 argument, like this:

<code>
-> x, y {
  x + y
}.call(3, 4)
</code>

we could rewrite this proc like this:

<code>
-> x {
  -> y {
    x + y
  }
}.call(3).call(4)
</code>

#### Equality

Two procs are equal when they have the same result with the same arguments, one example follows above:

<code>
p = -> n { n * 2 }
q = -> x { p.call(x) }
</code>

Now, every argument we pass to both procs will generate the same result.

<code>
p.call(5)
=> 10
q.call(5)
=> 10
</code>

#### Syntax

And leaving the easier to the end, the syntax is very simple, -> arguments { body }[ arguments values ], now, instead of using the method .call(), we're going to start using [] with the values inside.

<code>
-> x { x + 5 }[6]
=> 11
</code>

Now, we're ready to start solving a problem programming lambda calculus. There's an algorithm called "FizzBuzz", it basically loops from 1 to 100, prints every number, when the number is multiply of three, it prints Fizz, if the number is multiply of five, it prints Buzz, and if the number is multiply of 15, it prints FizzBuzz, see the whole algorithm using Ruby:

<code>
(1...100).map do |n|
  if (n % 15).zero?
    puts "FizzBuzz"
  elsif (n % 3).zero?
    puts "Fizz"
  elsif (n % 5).zero?
    puts "Buzz"
  else
    puts n.to_s
  end
end
</code>

So, as we can see, we can use none of those features, so, let's start to implement those features using lambda calculus, starting with the numbers.

### Numbers

It's crazy to stop and think in this phrase: "Implementing numbers", how can we do it? How can we define a number? One way of thinking about numbers is thinking about two bags full of apples, we can start taking 1 at a time from both bags, if they become empty at same time, they have something in common, and by repeatedly moves, we've discovered it. So, one way of implement number is by repetition of an action. Let's begin to implement it by using ruby's features, them we convert it into procs:

<code>
  def one(proc, x)
    proc[x]
  end
<br>
  def two(proc, x)
    proc[proc[x]]
  end
<br>
  def three(proc, x)
    proc[proc[proc[x]]]
  end
<br>
  def zero(proc, x)
    x
  end
</code>

The repetition that we're using here is the proc call, so, it's easy to convert into procs.

<code>
ZERO = -> p { -> x { x }}
ONE = -> p { -> x { p[x] } }
TWO = -> p { -> x { p[p[x]] } }
THREE = -> p { -> x { p[p[p[x]]] } }
</code>

So, now we're not using features that we can't use. We could see if this works by implemeting a method called "to_integer", this method looks like this:

<code>
def to_integer(proc)
  proc[-> n { n + 1 }][0]
end

to_integer(ZERO)
=> 0
to_integer(THREE)
=> 3
</code>

But, we need to have the 5, 15 and 100, so we can use them on the FizzBuzz:

<code>
FIVE = -> p { -> x { p[p[p[p[p[x]]]]] } }
FIFTEEN = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]] } }
HUNDRED = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p
                        [p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p
                        [p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p
                        [p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]]
                        ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
                        ]]]]]]]]]]]]]]]]]]]]]]]]]]]]] } }
</code>

Now that we have the numbers, we can substitute on the FizzBuzz code:

<code>
(ONE...HUNDRED).map do |n|
  if (n % FIFTEEN).zero?
    puts "FizzBuzz"
  elsif (n % THREE).zero?
    puts "Fizz"
  elsif (n % FIVE).zero?
    puts "Buzz"
  else
    puts n.to_s
  end
end
</code>

Numbers are the main thing on this algorithm, but, the only way of printing "Fizz", "Buzz" and "FizzBuzz" is validating some if's, and this is where the booleans come to the scene. Booleans are like a path of two ways, we need to choose one, the chosen one is the "true", the one left is the "false", so, how could we represent it by procs? First, let's visualize it on normal Ruby:

<code>
def true(x, y)
  x
end
<br>
def false(x, y)
  y
end
</code>

Easy to convert into procs, right? Right.

<code>
TRUE = -> x { -> y {x} }
FALSE = -> x { -> y {y} }
</code>

Basically we receive two values and return one of those. Let's check if this is working:

<code>
def to_boolean(proc)
  proc[true][false]
end
<br>
to_boolean(TRUE)
=> true
</code>

Works fine. Now that we have booleans, we can try to implement a famous control statement, called IF, but, what is an IF? As I said, it's a control statement that receives a statement as its conditional, this conditional is evaluated to boolean, if it's true, executes the if's body, if it's false, executes the else's body. So, let's try to implement it on Ruby:

<code>
def if(proc, x, y)
  proc[x][y]
end
</code>

What this does is basically receive a proc(TRUE or FALSE), if TRUE, just executes "x", else, executes "y". Easy, no? Let's convert it.

<code>
IF =
  -> b {
    -> x {
      -> y {
        b[x][y]
      }
    }
  }
</code>

There are some unnecessary code in here, can you see it? The booleans already takes 2 arguments, and they now where to go after that, so why should we put arguments inside the if? Basically we should just return the boolean, like this:

<code>
IF = -> b { b }
</code>

And if we call it like this:

<code>
IF[TRUE]['happy']['sad']
=> 'happy'
</code>

Perfect, let's update our FizzBuzz algorithm.

<code>
(ONE...HUNDRED).map do |n|
  IF[(n % FIFTEEN).zero?][
    puts "FizzBuzz"
  ][IF [(n % THREE).zero?][
    puts "Fizz"
  ][IF [(n % FIVE).zero?][
    puts "Buzz"
  ][
    puts n.to_s
  ]]]
end
</code>

One method that we use on FizzBuzz is the "zero?", basically we need to return true if the proc represent a zero. The zero in procs receives two arguments, p and x, and return the x, without any repetition, so, with this in minde, we can start making the Ruby version of this method:

<code>
def zero? (proc)
  proc[ -> { FALSE }][TRUE]
end
</code>

Basically, x receives true, if it's returned, we get a true. Let's put it on the algorithm.

<code>
(ONE...HUNDRED).map do |n|
  IF[IS_ZERO[n % FIFTEEN]][
    puts "FizzBuzz"
  ][IF [IS_ZERO[n % THREE]][
    puts "Fizz"
  ][IF [IS_ZERO[n % FIVE]][
    puts "Buzz"
  ][
    puts n.to_s
  ]]]
end
</code>

Now we only have numbers and booleans, but we don't have a structure for storing those, the simplest data structure is a pair, it's a array of two elements, and they're very easy to implement:

<code>
PAIR = -> x { -> y { -> f { f[x][y] } } }
LEFT = -> p { p[-> x {-> y { x } } ] }
RIGHT = -> p { p[-> x {-> y { y } } ] }
</code>

This way, we can store data and then, access it whenever you want. Let's see if it's working.

<code>
my_pair = PAIR[THREE][FIVE]
=> <#Proc (lambda)>
to_integer(LEFT[my_pair])
=> 3
to_integer(RIGHT[my_pair])
=> 5
</code>

Working perfectly. Our goal now is to implement the modulo operator, but, to achieve this goal, we need to implement some numeric operations, let's start with the basics one, increment and decrement, the increment is easy, we just need to add one more repetition on the number we provided. Look:

<code>
INCREMENT = -> n { -> p { -> x { p[n[p][x]] } } }
</code>

Now, how could we implement the decrement? We can't remove one p[] from the repetition, but we could use something called slide, basically slide takes a pair of numbers, and always returns other pair, the left part is the right part of the first pair, and the right pair is the right part of the first pair plus one. Look at its implementation on Ruby:

<code>
def slide(pair)
  [pair.last, pair.last + 1]
end
</code>

So if we do:

<code>
slide([3, 4])
=> [4, 5]
</code>

We can use this slide in out favor, because when we slide a pair of zeros, the left side will represent the decremented value of the right side, so, we can use this to implement decrement.

<code>
slide([0, 0])
=> [0, 1]
slide(([0, 0]))
=> [1, 2]
slide(slide(slide([0, 0])))
=> [2, 3]
</code>

Let's do the implementation:

<code>
SLIDE = -> p { PAIR[RIGHT[p]][INCREMENT[RIGHT[p]]] }
DECREMENT = -> n { LEFT[n[SLIDE][PAIR[ZERO][ZERO]]] }
</code>

Let's see if it's working:

<code>
to_integer(DECREMENT[FIVE])
=> 4
</code>

Now that we have the basics, we can implement the more useful numeric operations.

<code>
ADD = -> m { -> n { n[INCREMENT][m] } }
SUBTRACT = -> m { -> n {n[DECREMENT][m] } }
MULTIPLY = -> m { -> n {n[ADD[m]][ZERO] } }
POWER = -> m { -> n { n[MULTIPLY[m]][ONE] } }
</code>

Now we have enough tools to start implementing the modulo operator. Let's see its implementation in Ruby:

<code>
def mod(m, n)
  if n <= m
    mod(m - n, n)
  else
    m
  end
end
</code>

Basically, it substracts m until it becomes less or equal to n, and return it when this happens. For this, we will need to implement the "less or equal" operator, we can begin by looking at its implementation on Ruby:

<code>
def less_or_equal?(m, n)
  m - n <= 0
end
</code>

But, this isn't useful for us because we're depending on the "<=" operator, so, no use. One fact about this programming style will helps, the fact is that we don't have negatives numbers, so, every substraction that would be negative, will be zero, this way, it's 100 times easier now:

<code>
def less_or_equal?(m, n)
  IS_ZERO[SUBSTRACT[m][n]]
end
</code>

The conversion is almost done, we just need to change the method to proc:

<code>
IS_LESS_OR_EQUAL =
  -> m { -> n {
    IS_ZERO[SUBTRACT[m][n]]
  } }
</code>

Let's check if it works:

<code>
to_boolean(IS_LESS_OR_EQUAL[ONE][TWO])
=> true
</code>

Looks perfect. Now we have the missing piece of the modulo operator implementation. Let's rewrite it:

<code>
MOD =
  -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      MOD[SUBTRACT[m][n]]
    ][
      m
    ]
  } }
</code>

Let's check if works:

<code>
to_integer(MOD[THREE][TWO])
SystemStackError: stack level too deep
</code>

Ops, something happened, we're going on an infinite recursive loop, because in Ruby we have something that we don't on Lambda Calculus, and this thing is: the if-else statement is nonstrict, this means that after condition evaluation, it decides which block will be evaluated, never evaluates both. Our if don't take advantage of this behavior, it just say: "call a proc, IF, with two other procs", then Ruby charges and evaluate both blocks before IF gets a chance of deciding what to return.

When we call MOD with values m and n, Ruby evaluation starts by the body of the inner proc, it reachs the recursive call to MOD[SUBTRACT[m][n]] and immediately starts evaluating it as an argument to pass to IF, regardless of the IS_LESS_OR_EQUAL[n][m] evaluation. This second call to MOD results in another unconditional recursive call, and so on, infinite loop.

To fix this we need to wrap it into a proc and knowing the equality property of procs that says: if you wrap any proc p with another proc that takes the same arguments as p and immediately calls p with them will produce a value that isn't different from just p. Let's use this trick:

<code>
MOD =
  -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      -> x {
        MOD[SUBTRACT[m][n]][x]
      }
    ][
      m
    ]
  } }
</code>

This will wrap the recursive MOD call and Ruby won't try to evaluate the body of the proc when it calls IF. Let's see if it's working:

<code>
to_integer(MOD[THREE][TWO])
=> 1
</code>

A better way of doing recursive calls is using a piece of code called "Y combinator", look what it looks like:

Y = -> f { -> x { f[x[x]] }[ -> x { f[x[x]] }] }

Y combinator is hard to explain without lots of details, but we could try: when we call the Y combinator with a proc, it will call that proc with the proc itself as the first argument, so, if we write a proc that expects an argument and then call the Y combinator with that proc, then the proc will get itself as that argument and therefore can use that argument whenever it wants to call itself.

The Y combinator don't work on Ruby, we need to change it a little bit. The expression x[x] causes the problem, and we can again fix the problem by wrapping the occurrences of that expression with the procs like -> y { ...[y] } to defer their evaluation:

Z = -> f { -> x { f[-> y { x[x][y] }] }[ -> x { f[ -> y { x[x][y] }] }] }

This is Z combinator, The ruby version of Y combinator, now we can use it on MOD proc:

<code>
MOD =
  Z[-> f { -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      -> x {
        f[SUBTRACT[m][n]][n][x]
      }
    ][
      m
    ]
  } } } ]
</code>

We can test it:

<code>
to_integer(MOD[THREE][TWO])
=> 1
</code>

And substitute the modulo operator on FizzBuzz implementation:

<code>
(ONE...HUNDRED).map do |n|
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    puts "FizzBuzz"
  ][IF [IS_ZERO[MOD[n][THREE]]][
    puts "Fizz"
  ][IF [IS_ZERO[MOD[n][FIVE]]][
    puts "Buzz"
  ][
    puts n.to_s
  ]]]
end
</code>

Now, we have 4 things missing to end reimplementation of FizzBuzz: to_s, strings, range and map. To be able to implement ranges and map, we need to implement lists, we already have pairs, and we can use them to help us. The implementation will be like lots of pairs linked together, which each pair will store a value and one pointer to the next pair in the list, in this case we use nested pairs. Some operations look like this:


<code>
EMPTY = PAIR[TRUE][TRUE]
UNSHIFT = -> l { -> x {
    PAIR[FALSE][PAIR[x][l]]
  } }
IS_EMPTY = LEFT
FIRST = -> l { LEFT[RIGHT[l]]}
REST = -> l { RIGHT[RIGHT[l]]}
</code>

And the work like this:


<code>
my_list = UNSHIFT[
  UNSHIFT[
    UNSHIFT[EMPTY][THREE]
  ][TWO]
][ONE]
<br>
to_integer(FIRST[my_list])
=> 1
to_integer(FIRST[REST[my_list]])
=> 2
to_integer(FIRST[REST[REST[my_list]]])
=> 3
</code>

Using FIRST and REST to check out some values on the list is a little bit boring, it's better to use a to_array method, look at this one:

<code>
def to_array(proc)
  array = []
<br>
  until to_boolean(IS_EMPTY[proc])
    array.push(FIRST[proc])
    proc = REST[proc]
  end
<br>
  array
end
</code>

and then we just inspect the list like this:

<code>
to_array(my_list).map { |p| to_integer(p) }
=> [1, 2, 3]
</code>

Now, let's start thinking about how can we implement ranges. We can write a proc that builds a list with all elements in a range. For Ruby, we could write like this:

<code>
def range(m, n)
  if m <= n
    range(m + 1, n).unshift(m)
  else
    []
  end
end
</code>

Happily, we already have Z combinator and the features to convert it:

<code>
RANGE =
  Z[ -> f {
    -> m { -> n {
      IF[IS_LESS_OR_EQUAL[m][n]][
        -> x {
          UNSHIFT[f[INCREMENT[m]][n]][m][x]
        }
      ][
        EMPTY
      ]
    } }
  }]
</code>

Does it work? Let's see.

<code>
my_range = RANGE[ONE][FIVE]
=> #<Proc..>
to_array(my_range).map { |p| to_integer(p)}
=> [1, 2, 3, 4, 5]
</code>

Yoohoo, it's working, now we can put it on the FizzBuzz implementation.

<code>
RANGE[ONE][HUNDRED].map do |n|
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    puts "FizzBuzz"
  ][IF [IS_ZERO[MOD[n][THREE]]][
    puts "Fizz"
  ][IF [IS_ZERO[MOD[n][FIVE]]][
    puts "Buzz"
  ][
    puts n.to_s
  ]]]
end
</code>

To implement map, we will use a helper called FOLD, it's like Enumerable from Ruby:

<code>
  FOLD =
    Z[-> f {
      -> l { -> x { -> g {
        IF[IS_EMPTY[l]][
          x
        ][
          -> y {
            g[f[REST[l]][x][g]][FIRST[l]][y]
          }
        ]
      } } }
    }]
</code>

FOLD processes every item in a list:

<code>
to_integer(FOLD[RANGE[ONE][FIVE]][ONE][MULTIPLY])
=> 120
</code>

And we can use it to implement map:

<code>
MAP =
  -> k { -> f {
    FOLD[k][EMPTY][
      -> l { -> x { UNSHIFT[l][f[x]] } }
    ]
  } }
</code>

Let's test the funcionallity of map:

<code>
my_list = MAP[RANGE[ONE][FIVE]][INCREMENT]
to_array(my_list).map { |p| to_integer(p) }
=> [2, 3, 4, 5, 6]
</code>

And replace the Ruby map to the new map:

<code>
MAP[RANGE[ONE][HUNDRED]][ -> n {
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    puts "FizzBuzz"
  ][IF [IS_ZERO[MOD[n][THREE]]][
    puts "Fizz"
  ][IF [IS_ZERO[MOD[n][FIVE]]][
    puts "Buzz"
  ][
    puts n.to_s
  ]]]
}]
</code>

We're almost done. Let's deal with strings now, the better way is to follow like an encoding, we can use the number 0 to 9 to represent themselves in strings, and from 10 to 14 to represent the letters: 'B', 'F', 'i', 'u' and 'z'. This gives us the representation of the strings we need, let's do it:

<code>
TEN = MULTIPLY[TWO][FIVE]
B = TEN
F = INCREMENT[B]
I = INCREMENT[F]
U = INCREMENT[I]
ZED = INCREMENT[U]
<br>
FIZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[EMPTY][ZED]][ZED]][I]][F]
BUZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[EMPTY][ZED]][ZED]][U]][B]
FIZZBUZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[BUZZ][ZED]][ZED]][I]][F]
</code>

To check if everything is perfect:

<code>
def to_char(c)
  '0123456789BFiuz'.slice(to_integer(c))
end
<br>
def to_string(s)
  to_array(s).map { |c| to_char(c) }.join
end
<br>
to_char(ZED)
=> 'z'
</code>

Let's update our FizzBuzz implementation:

<code>
MAP[RANGE[ONE][HUNDRED]][ -> n {
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    FIZZBUZZ
  ][IF [IS_ZERO[MOD[n][THREE]]][
    FIZZ
  ][IF [IS_ZERO[MOD[n][FIVE]]][
    BUZZ
  ][
    puts n.to_s
  ]]]
}]
</code>

The last thing to implement is to_s. For that, we need to be able to split a number into is component digits, look how we can do it in Ruby:

<code>
def to_digits(n)
  previous_digits =
    if n < 10
      []
    else
      to_digits( n / 10 )
    end
<br>
  previous_digits.push( n % 10 )
end
</code>

We can avoid n < 10 by using n <= 9 instead, but we can't avoid the division and the push method, let's implement them:

<code>
  DIV =
    Z[ -> f { -> m { -> n {
      IF[IS_LESS_OR_EQUAL[n][m]][
        -> x {
          INCREMENT[f[SUBTRACT[m][n]][n]][x]
        }
      ][
        ZERO
      ]
    } } }]
<br>
  PUSH =
    -> l {
      -> x {
        FOLD[l][UNSHIFT[EMPTY][x]][UNSHIFT]
      }
    }
</code>

Now we can rewrite to_digits into a proc:

<code>
TO_DIGITS =
  Z[ -> f { -> n { PUSH[
    IF[IS_LESS_OR_EQUAL[n][DECREMENT[TEN]]][
      EMPTY
    ][
      -> x {
        f[DIV[n][TEN]][x]
      }
    ]
  ][MOD[n][TEN]] } }]
</code>

Let's see if works:

<code>
to_array(TO_DIGITS[POWER[FIVE][THREE]]).map { |p| to_integer(p) }
=> [1, 2, 5]
</code>

And using the to_string implementation, with all the enconding we did, let's produce a string from the array produced by TO_DIGITS:

<code>
to_string(TO_DIGITS[POWER[FIVE][THREE]])
=> '125'
</code>

And now, the last change on FizzBuzz:

<code>
MAP[RANGE[ONE][HUNDRED]][ -> n {
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    FIZZBUZZ
  ][IF [IS_ZERO[MOD[n][THREE]]][
    FIZZ
  ][IF [IS_ZERO[MOD[n][FIVE]]][
    BUZZ
  ][
    TO_DIGITS[n]
  ]]]
}]
</code>

We've finished, let's see how it works:

<code>
  solution =
  MAP[RANGE[ONE][HUNDRED]][ -> n {
    IF[IS_ZERO[MOD[n][FIFTEEN]]][
      FIZZBUZZ
    ][IF [IS_ZERO[MOD[n][THREE]]][
      FIZZ
    ][IF [IS_ZERO[MOD[n][FIVE]]][
      BUZZ
    ][
      puts n.to_s
    ]]]
  }]
<br>
to_array(solution).each do |p|
  puts to_string(p)
end; nil
1
2
Fizz
4
Buzz
Fizz
.
.
.
94
Buzz
Fizz
97
98
Fizz
Buzz
=> nil
</code>

So, this post ends here, in the next post, we will see some things that we can do with Lambda Calculus, create an interpreter for it and parse it. Hope to have you in the next post.
{% for author in site.data.author%}
If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
