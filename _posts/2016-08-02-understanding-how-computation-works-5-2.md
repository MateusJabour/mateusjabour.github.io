---
layout: posts
title: "Understanding how computation works part 5-2"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going to what more we can do with lambda calculus, we're going to also try to implement an interpreter for lambda calculus and parse this interpreter."
homeImage: "/assets/img/understanding-how-computation-works-5-2.jpg"
type: post
permalink: understanding-how-computation-works-5-2
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

Using just procs to build a program is quite a challenge, but we've seen that's possible, let's take a look at a couple of techniques for writing code in this minimal style.

####Infinite streams

Streams are pretty interesting to implement, because it's an infinite list that we can do whatever we want just by using FIRST and REST, with this we can implement lists that calculate their contents on the fly. Look at one implementation of an infinite stream of zeros:

<code>
ZEROS = Z[-> f { UNSHIFT[f][ZERO] }]
</code>

We will need to update the method to_array so we can limit the number of elements we want to display, instead of receiving a infinite array. Let's do it:

<code>
def to_array(proc, count = nil)
  array = []
<br>
  until to_boolean(IS_EMPTY[proc]) || count == 0
    array.push(FIRST[proc])
    proc = REST[proc]
    count = count - 1 unless count.nil?
  end
<br>
  array
end
</code>

Now, we can visualize how it works:

<code>
to_array(ZEROS, 5).map { |p| to_integer(p) }
=> [0, 0, 0, 0, 0]
to_array(ZEROS, 10).map { |p| to_integer(p) }
=> [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
</code>

Here, we don't have any calculation of a new element. An other interesting thing to implement is the proc that counts upwards from a given number:

<code>
UPWARDS_OF = Z[ -> f { -> n { UNSHIFT[ -> x { f[INCREMENT[n]][x] }][n] } }]
</code>

Let's see if how it works:

<code>
to_array(UPWARDS_OF[ZEROS], 5).map { |p| to_integer(p) }
=> [0, 1, 2, 3, 4]
to_array(UPWARDS_OF[FIFTEEN], 5).map { |p| to_integer(p) }
=> [15, 16, 17, 18, 19]
</code>

A more complex is the stream that contains all multiples of a given number:

<code>
MULTIPLES_OF =
  -> m {
    Z[-> f {
      -> n { UNSHIFT[-> x { f[ADD[m][n]][x] }][n] }
    }][m]
  }
to_array(MULTIPLES_OF[TWO], 5).map { |p| to_integer(p) }
=> [2, 4, 6, 8, 10]
</code>

We can manipulate those streams like lists, using map, for example:

<code>
to_array(MAP[MULTIPLES_OF[TWO]][INCREMENT], 5).map { |p| to_integer(p) }
=> [3, 5, 7, 9, 11]
</code>

We can even write procs that combine two streams to make a third:

<code>
MULTIPLY_STREAMS =
  Z[-> f {
    -> k { -> l {
      UNSHIFT[-> x { f[REST[k]][REST[l]][x] }][MULTIPLY[FIRST[k]][FIRST[l]]]
    }}
  }]
to_array(MUTIPLY_STREAMS[UPWARDS_OF[ONE]][MULTIPLES_OF[THREE]], 5).map { |p| to_integer(p) }
=> [3, 12, 27, 48, 75]
</code>

####Avoiding arbritary recursion

As we saw on the implementations of MOD and RANGE, we needed to use the Z combinator, so those procs could work. The Z combinator is very convinient, but not ideal, we can implement those procs without using the Z combinator. Let's try yo implement MOD without it, we know that MOD works by repeatedly subtracting n from m as long as n <= m, using recursive calls of MOD. But, instead of using recursion we start to use a fixed number to check if n <= m, we don't know exactly how many time we need to check it, but it isn't a big problem to check more than we need, right?

<code>
def decrease(m, n)
  if n <= m
    m - n
  else
    m
  end
end
decrease(17, 5)
=> 12
decrease(decrease(17, 5), 5)
=> 7
decrease(decrease(decrease(17, 5), 5), 5)
=> 2
decrease(decrease(decrease(decrease(17, 5), 5), 5), 5)
=> 2
</code>

Now we can rewrite the MOD proc to take a number and substracts n from it or just returns it. This proc gets called m times on m itself, so we can get the result:

<code>
MOD =
  -> m { -> n {
    m[ -> x {
      IF[IS_LESS_OR_EQUAL[n][x]][
        SUBTRACT[x][n]
      ][
        x
      ]
    }]
  } }
</code>

Let's check it:

<code>
to_integer(MOD[THREE][TWO])
=> 1
</code>

Cool, implementing RANGE is harder, but we can try to use the same thinking of DECREMENT here: implement a function that, when called n time on a value, returns a list of n numbers from the desired range. This first function would be a countdown:

<code>
def countdown(pair)
  [pair.first.unshift(pair.last), pair.last - 1]
end
<br>
countdown([[], 10])
=> [[10], 9]
countdown(countdown([[], 10]))
=> [[9, 10], 8]
countdown(countdown(countdown([[], 10])))
=> [[8, 9, 10], 7]
</code>

This is easy to convert into procs:

<code>
COUNTDOWN = -> p { PAIR[UNSHIFT[LEFT][p]][RIGHT[p]][DECREMENT[RIGHT[p]]] }
</code>

And now, the new RANGE will look like this:

<code>
RANGE = -> m { -> n { LEFT{INCREMENT[SUBTRACT[n][m]][COUNTDOWN][PAIR[EMPTY][n]] } } }
</code>

#### Implementing the Lambda Calculus

Now that we now a lot about Lambda Calculus, we can try to implement an interpreter for it, let's start implementing it by the syntax. We know that we have 3 primordial things in Lambda Calculus: variables, functions and the calls, so, we're going to implement a class for each of those items:

<code>
class LCVariable < Struct.new(:name)
  def to_s
    name.to_s
  end
<br>
  def inspect
    to_s
  end
end
<br>
class LCFunction < Struct.new(:parameter, :body)
  def to_s
    "-> #{parameter} { #{body}}"
  end
<br>
  def inspect
    to_s
  end
end
<br>
class LCCall < Struct.new(:left, :right)
  def to_s
    "#{left}[#{right}]"
  end
<br>
  def inspect
    to_s
  end
end
</code>

These classes let us build abstract syntax trees of lambda calculus expressions, just like we did on previous posts. Look what we can do:

<code>
  one =
    LCFunction.new(:p,
      LCFunction.new(:x,
        LCCall.new(LCVariable.new(:p), LCVariable.new(:x))
      )
    )
  => -> p { -> x { p[x]}}
  increment =
    LCFunction.new(:n,
      LCFunction.new(:p,
        LCFunction.new(:x,
          LCCall.new(
            LCVariable.new(:p),
            LCall.new(
              LCCall.new(LCVariable.new(:n), LCVariable.new(:p)),
              LCVariable.new(:x)
            )
          )
        )
      )
    )
    => -> n { -> p { -> x { p[n[p][x]]}}}
</code>

Now, let's talk about semantics, we're going to use small-step to implement the reduce method, let's start by replacing variables:

<code>
class LCVariable
  def replace(name, replacement)
    if self.name == name
      replacement
    else
      self
    end
  end
end
<br>
class LCFunction
  def replace(name, replacement)
    if parameter == name
      self
    else
      LCFunctio.new(parameter, body.replace(name, replacement))
    end
  end
end
<br>
class LCCall
  def replace(name, replacement)
    LCCall.new(left.replace(name, replacement), right.replace(name, replacement))
  end
end
</code>

Let's see their effect:

<code>
expression = LCVariable.new(:x)
=> x
expression.replace(:x, LCFunction.new(:y, LCVariable.new(:y)))
=> -> y { y }
</code>

For functions, we have a problem, the replace method just have effect inside the function's body, and just make the replacement on free variables:

<code>
expression =
  LCFunction.new(:y,
    LCCall.new(LCVariable.new(:x), LCVariable.new(:y))
  )
=> -> y { x[y] }
expression.replace(:x, LCVariable.new(:z))
=> -> y { z[y] }
expression.replace(:y, LCVariable.new(:z))
=> -> y { x[y] }
</code>

This lets us replace occurrences of a variable without accidentally changing unrelated variables that happen to have the same name.

So, now that we have this feature, we need to think in a way of replacing the arguments values of a function, let's think about the real execution: If we call a proc -> x, y { x + y } with the arguments 1 and 2, it will produce the expression 1 + 2 immediately, then, it will evaluate this expression and return the final result. With this in mind, let's implement a method called "call":

<code>
class LCFunction
  def call(argument)
    body.replace(parameter, argument)
  end
end
</code>

This will be enough. To start reducing the expressions, we need to know if they're callable and reducible:

<code>
class LCVariable
  def callable?
    false
  end
<br>
  def reducible?
    false
  end
end
<br>
class LCFunction
  def callable?
    true
  end
<br>
  def reducible
    false
  end
end
<br>
class LCCall
  def callable?
    false
  end
<br>
  def reducible?
    left.reducible? || right.reducible? || left.callable?
  end
end
</code>

And now, we can reduce it if the expression is reducible:

<code>
class LCCall
  def reduce
    if left.reducible?
      LCCall.new(left.reduce, right)
    elsif right.reducible?
      LCCall.new(left, right.reduce)
    else
      left.call(right)
    end
  end
end
</code>

Now that everything is ready, we can parse all this interpreter using Treetop, let's start:

<code>
grammar LambdaCalculus
  rule expression
    calls / variable / function
  end
<br>
  rule calls
    first:(variable / function) rest: ('[' expression ']')+ {
      def to_ast
        arguments.map(&:to_ast).inject(first.to_ast) { |l, r| LCCall.new(l, r)}
      end
<br>
      def arguments
        rest.elements.map(&:expression)
      end
    }
  end
<br>
  rule variable
    [a-z]+ {
      def to_ast
        LCVariable.new(text_value.to_sym)
      end
    }
  end
<br>
  rule function
    '-> ' parameter:[a-z]+ ' { ' body:expression ' }' {
      def to_ast
        LCFunction.new(parameter.text_value.to_sym, body.to_ast)
      end
    }
  end
end
</code>

The operational semantics and the parser together give us a complete implementation of the lambda calculus.


{% for author in site.data.author%}
If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
