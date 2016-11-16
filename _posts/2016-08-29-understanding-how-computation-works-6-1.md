---
layout: posts
title: "Understanding how computation works part 6-1"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going to see how to simulate a Turing machine with lambda calculus, and learn about two ways of writing programs: Partial Recursive Functions and SKI Combinator Calculus."
homeImage: "/assets/img/understanding-how-computation-works-6-1.jpg"
type: post
permalink: understanding-how-computation-works-6-1
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

We saw on the post 5 the design og a universal Turing machine and on post 6 we saw a minimal way of writing simple programs. We know that a Turing machine can adapt to arbitrary tasks, just by reading instructions from a tape. These instructions are like a piece of software that controls the machine to do the task, like our computers.

In this post, we're going to se several simple and universal systems, all capable of simulating a Turing machine or any arbitrary program provided as input instead of hardcoded into the rules of the system.

We've seen that the lambda calculus is a usable programming language, but, we didn't test its power, we don't know if it's as powerful as a Turing machine. At least, lambda calculus has the same power, since we can simulate a Turing machine using lambda calculus. We can taste how it works by implementing part of a Turing machine.

If you remember, a Turing machine has four attributes, the list of characters on the left, the character on the middle, the list of characters on the right, and the blank part. Let's implement a represatation of those attributes:

<code>
TAPE = -> l { -> m { -> r { -> b { PAIR[PAIR[l][m]][PAIR[r][b]] } } } }
TAPE_LEFT = -> t { LEFT[LEFT[t]] }
TAPE_MIDDLE = -> t { RIGHT[LEFT[t]] }
TAPE_RIGHT = -> t { LEFT[RIGHT[t]] }
TAPE_BLANK = -> t { RIGHT[RIGHT[t]] }
</code>

Tape is represented by a pair of pair. Now that we have the data structure, let's implement a method, TAPE_WRITE, to write on the current middle position:

<code>
TAPE_WRITE = -> t { -> c { TAPE[TAPE_LEFT[t]][c][TAPE_RIGHT[t]][TAPE_BLANK[t]] } }
</code>

We can also implement a method to move the tape to the right:

<code>
TAPE_MOVE_HEAD_RIGHT =
  -> t {
    TAPE[
      PUSH[TAPE_LEFT[t]][TAPE_MIDDLE[t]]
    ][
      IF[IS_EMPTY[TAPE_RIGHT[t]]][
        TAPE_BLANK[t]
      ][
        FIRST[TAPE_RIGHT[t]]
      ]
    ][
      IF[IS_EMPTY[TAPE_RIGHT[t]]][
        EMPTY
      ][
        REST[TAPE_RIGHT[t]]
      ]
    ][
      TAPE_BLANK[t]
    ]
  }
</code>

Look how it works:

<code>
current_tape = TAPE[EMPTY][ZERO][EMPTY][ZERO]
=>#<Proc:0x005637fb9c5520...>
current_tape = TAPE_WRITE[current_tape][ONE]
=>#<Proc:0x005637fb9c2370...>
current_tape = TAPE_MOVE_HEAD_RIGHT[current_tape]
=>#<Proc:0x005637fb9b6c00...>
current_tape = TAPE_WRITE[current_tape][TWO]
=>#<Proc:0x005637fb9b2330...>
current_tape = TAPE_MOVE_HEAD_RIGHT[current_tape]
=>#<Proc:0x005637fb9a15a8...>
current_tape = TAPE_WRITE[current_tape][THREE]
=>#<Proc:0x005637fb99d750...>
current_tape = TAPE_MOVE_HEAD_RIGHT[current_tape]
=>#<Proc:0x005637fb988e18...>
to_array(TAPE_LEFT[current_tape]).map { |p| to_integer(p) }
=>[1, 2, 3]
to_integer(TAPE_MIDDLE[current_tape])
=>0
</code>

We're going to stop the simulation here, but it isn't difficult to continue. We would need to implement two methods: STEP and RUN. STEP simulates the single step of a Turing maching by applying the rulebook to one configuration to produce another, and RUN runs STEP recursively until the machine reachs a accept state.

#### Partial Recursive Functions

The partial recursive functions consists in building programs from four main building block in different combinations. The first two blocks are trivial, zero and increment:

<code>
def zero
  0
end
<br>
def increment(n)
  n + 1
end
</code>

These are simple, we can use them to define new methods:

<code>
def two
  increment(increment(zero))
end
<br>
two
=> 2
<br>
def three
  increment(two)
end
<br>
three
=> 3
<br>
def add_three(x)
  increment(increment(increment(x)))
end
<br>
add_three(two)
=> 5
</code>

the third block is more complicated to understand, it's called #recurse:

<code>
def recurse(f, g, *values)
  *other_values, last_value = values
<br>
  if last_value.zero?
    send(f, *other_values)
  else
    easier_last_value = last_value - 1
    easier_values = other_values + [easier_last_value]
<br>
    easier_result = recurse(f, g, *easier_values)
    send(g, *easier_values, easier_result)
  end
end
</code>

Basically, #recurse takes two method names as arguments, f and g, and uses them to perform a calculation using recursion on values that passed on *values. Recurse behaves differently depeding on the last input:

- if the last input is zero, #recurse calls the method named by f, passing the rest of the values as arguments for f.
- if the last input isn't zero, #recurse decrement it, calls itself with the updated input values, and then calls the method named by g with those same values and the result of the recursive call.

So, let's try to implement an #add method using those building blocks, first we need to think what are the two methods we're using inside #recurse. When the last value is zero, the best to do I'd say that's to add the value to zero, right? So:

<code>
def add_zero_to_x(x)
  x
end
</code>

And, for each recursive call of recurse, we should increment the number, since the number of recursive calls is equal to the last value.

<code>
def increment_easier_result(x, easier_y, easier_result)
  increment(easier_result)
end
</code>

And now, we have #add:

<code>
def add(x, y)
  recurse(:add_zero_to_x, :increment_easier_result, x, y)
end
<br>
add(two, three)
=> 5
</code>

Cool, now we can do a lot of different methods with this building block:

<code>
#multiply
def multiply_x_by_zero(x)
  zero
end
<br>
def add_x_to_easier_result(x, easier_y, easier_result)
  add(x, easier_result)
end
<br>
def multiply(x, y)
  recurse(:multiply_x_by_zero, :add_x_to_easier_result)
end
<br>
#decrement
def easier_x(easier_x, easier_result)
  easier_x
end
<br>
def decrement(x)
  recurse(:zero, :easier_x, x)
end
<br>
#subtract
def subtract_zero_from_x(x)
  x
end
<br>
def decrement_easier_result(x, easier_y, easier_result)
  decrement(easier_result)
end
<br>
def subtract(x, y)
  recurse(:substract_zero_from_x, :decrement_easier_result, x, y)
end
</code>

Let's check if works:

<code>
multiply(two, three)
=> 6
<br>
def six
  multiply(two, three)
end
<br>
decrement(six)
=> 5
<br>
substract(six, two)
=> 4
<br>
substract(two, six)
=> 0
</code>

Those programs that we can build just with #zero, #increment and #recurse are called the primitive recursive functions. All primitive recursive functions are total, this means that regardless if their input, they always halt and return an answer. This happens because the method #recurse is the only legitimate way to define a recursive method. We could implement a single step of a Turing machine with we have by now.

The fourth fundamental operation is #minimize, this will bring to us a truly universal system.

<code>
def minimize
  n = 0
  n = n + 1 until yield(n).zero?
  n
end
</code>

#minimize take a block and calls it repeatedly with a single numeric argument. On the first call, we have 0 as the argument, then 1, then 2, and keep incrementing and calling the block with larger number until it retuns zero. With #minimize we can build many more functions. Let's implement #divide with #minimize:

<code>
def divide(x, y)
  minimize { |n| substract(increment(x), multiply(y, increment(n))) }
end
</code>

You can see that with this, when the second arguemtn becomes equal or bigger than the first, the block returns zero, and for each recursive call, it multiplies y to a number in order(0, then 1, then 2), until it discovers the division result.

<code>
divide(six, two)
=> 3
<br>
def ten
  increment(multiply(three, three))
end
<br>
ten
=> 10
divide(ten, three)
=> 3
</code>

Since #minimize can loop forever, #divide doesn't have to return an answer.

<code>
divide(six, zero)
SystemStackError: stack level too deep
</code>

#### SKI Combinator Calculus

The SKI Combinator Calculus is a system of rules for manipulating the syntax of expressions, just like the lambda calculus. We saw that lambda calculus was very simple and had 3 kinds of expression--variables, functions and calls--but the SKI calculus is even simpler, with only two kinds of expression--calls and alphabetics symbols-- and much easier rules. Its power comes from three special symbols, S, K, and I (called combinators), each has its reduction rule:

- Reduce S[a][b][c] to a[c][b[c]], where a, b and c can be any SKI calculus expressions.
- Reduce K[a][b] to a.
- Reduce I[a] to a.

For example, let's reduce I[S][K][S][I[K]]:

- S[K][S][I[K]] -> reducing I[S] to S
- S[K][S][K] -> reducing I[K] to K
- K[K][S[K]] -> reducing S[K][S][K] to K[K][S[K]]
- K -> reducing K[K][S[K]] to K

This is basically symbols being reordered, duplicated and discarded according to the reduction rules. So, it's easy to implement the avstract syntax of SKI expressions:

<code>
class SKISymbol < Struct.new(:name)
  def to_s
    name.to_s
  end
<br>
  def inspect
    to_s
  end
end
<br>
class SKICall < Struct.new(:left, :right)
  def to_s
    "#{left}[#{right}]"
  end
<br>
  def inspect
    to_s
  end
end
<br>
class SKICombiator < SKISymbol
end
<br>
S, K, I = [:S, :K, :I].map { |name| SKICombiator.new(name) }
</code>

And we can build some expressions with those classes:

<code>
x = SKISymbol.new(:x)
=> x
expression = SKICall.new(SKICall.new(S, K), SKICall.new(I, x))
=> S[K][I[x]]
</code>

We can use small-step operational semantics to this implementation by using reduction rules and applying those rules inside expressions. We just need to define #call to SKI combinator instances: S, K and I.

<code>
def S.call(a, b, c)
  SKICall.new(SKICall.new(a, c), SKICall(b, c))
end
<br>
def K.call(a, b)
  a
end
<br>
def I.call(a)
  a
end
</code>

Let's check if works:

<code>
y, z = SKISymbol.new(:y), SKISymbol.new(:z)
=> [y, z]
S.call(x, y, z)
=> x[z][y[z]]
</code>

But before using #call, we need to find the combinator on the expression, this is a bit hard since an expression is represented as a binary tree of SKICall objects:

<code>
expression = SKICall.new(SKICall.new(SKICall.new(S, x), y), z)
=> S[x][y][z]
combinator = expression.left.left.left
=> S
first_argument = expression.left.left.right
=> x
second_argument = expression.left.right
=> y
third_argument = expression.right
=> z
combinator.call(first_argument, second_argument, third_argument)
=> x[z][y[z]]
</code>

To facilitate our work with those structure, we can define the methods #combinator and #arguments on abstract syntax trees:

<code>
class SKISymbol
  def combinator
    self
  end
<br>
  def arguments
    []
  end
end
<br>
class SKICall
  def combinator
    left.combinator
  end
<br>
  def arguments
    left.arguments + [right]
  end
end
</code>

Now, we can discover which combinator to call:

<code>
expression
=> S[x][y][z]
combinator = expression.combinator
=> S
arguments = expression.arguments
=> [x, y, z]
combinator.call(*arguments)
=> x[z][y[z]]
</code>

This works fine just with this expression, but there are a couple of problems in the general case. First problem is the #combinator method just return the leftmost symbol from an expression, but that symbol isn't necessarily a combinator:

<code>
expression = SKICall.new(SKICall.new(x, y), z)
=> x[y][z]
combinator = expression.combinator
=> x
arguments = expression.arguments
=> [y, z]
combinator.call(*arguments)
SKIcombinator.rb:99:in `<main>': undefined method `call' for x:SKISymbol (NoMethodError)
</code>

And second, even if the lefmost symbol is a combinator, it isn't necessarily being called with the right number of arguments:

<code>
expression = SKICall.new(SKICall.new(S, x), y)
=> S[x][y]
combinator = expression.combinator
=> S
arguments = expression.arguments
=> [x, y]
combinator.call(*arguments)
SKIcombinator.rb:32:in `call': wrong number of arguments (given 2, expected 3) (ArgumentError)
</code>

To avoid these problem, we can define #callable?, so we can check before trying to reduce the expression:

<code>
class SKISymbol
  def callable?(*arguments)
    false
  end
end
<br>
def S.callable?(*arguments)
  arguments.length == 3
end
<br>
def K.callable?(*arguments)
  arguments.length == 2
end
<br>
def I.callable?(*arguments)
  arguments.length == 1
end
<br>
</code>

Now we can check the expression before reducing it:

<code>
expression = SKICall.new(SKICall.new(x, y), z)
=> x[y][z]
expression.combinator.callable?(*expression.arguments)
=> false
expression = SKICall.new(SKICall.new(S, x), y)
=> S[x][y]
expression.combinator.callable?(*expression.arguments)
=> false
expression = SKICall.new(SKICall.new(SKICall.new(S, x), y), z)
=> S[x][y][z]
expression.combinator.callable?(*expression.arguments)
=> true
</code>

And now, we're finally ready to implement the #reducible? and #reduce methods for SKI expressions:

<code>
class SKISymbol
  def reducible?
    false
  end
end
<br>
class SKICall
  def reducible?
    left.reducible? || right.reducible? || combinator.callable?(*arguments)
  end
<br>
  def reducible
    if left.reducible?
      SKICall.new(left.reduce, right)
    elsif right.reducible?
      SKICall.new(left, right.reduce)
    else
      combinator.call(*arguments)
    end
  end
end
</code>

We can now reduce the SKI expression by repeatedly calling #reduce until there's no more possible reductions. Let's see it:

<code>
swap = SKICall.new(SKICall.new(S, SKICall.new(K, SKICall.new(S, I))), K)
=> S[K[S[I]]][K]
expression = SKICall.new(SKICall.new(swap, x), y)
=> S[K[S[I]]][K][x][y]
=> S[K[S[I]]][K][x][y]
while expression.reducible?
  puts expression
  expression = expression.reduce
end; puts expression
S[K[S[I]]][K][x][y]
K[S[I]][x][K[x]][y]
S[I][K[x]][y]
I[y][K[x][y]]
y[K[x][y]]
y[x]
=> nil
</code>

We can produce complex behaviors with those three simple rules, so complex that it turns out to be universal. We can prove it's universal bt showing how to translate any lambda calculus expression into an SKI expression that does the same thing. We can do it by implementing a method called #as_a_function_of:

<code>
class SKISymbol
  def as_a_function_of(name)
    if self.name == name
      I
    else
      SKICall.new(K, self)
    end
  end
end
<br>
class SKICombiator
  def as_a_function_of(name)
    SKICall.new(K, self)
  end
end
<br>
class SKICall
  def as_a_function_of(name)
    left_function = left.as_a_function_of(name)
    right_function = right.as_a_function_of(name)
<br>
    SKICall.new(SKICall.new(S, left_function), right_function)
  end
end
</code>

We're not going to enter in details of how those methods works, but we know that it converts an SKI expression into a new one that turns back into the original when called with an argument. Let's see this working:

<code>
original = SKICall.new(SKICall.new(S, K), I)
=> S[K][I]
function = original.as_a_function_of(:x)
=> S[S[K[S]][K[K]]][K[I]]
function.reducible?
=> false
</code>

When this new expression is called with an argument, like the symbol y, it reduces back to original:

<code>
expression = SKICall.new(function, y)
=> S[S[K[S]][K[K]]][K[I]][y]
while expression.reducible?
  puts expression
  expression = expression.reduce
end; puts expression
S[S[K[S]][K[K]]][K[I]][y]
S[K[S]][K[K]][y][K[I][y]]
K[S][y][K[K][y]][K[I][y]]
S[K[K][y]][K[I][y]]
S[K][K[I][y]]
S[K][I]
expression == original
=> true
</code>

It's interesting when you have an expression with a symbol(x), then you use #as_a_function_of with this symbol as an argument(x), then you add another symbol(y) in the end of this function, and reduce it. You will notice that the function will be reduce to the original but with the new symbol on the place of the old one. Have a look:

<code>
original = SKICall.new(SKICall.new(S, x), I)
=> S[x][I]
function = original.as_a_function_of(:x)
=> S[S[K[S]][I]][K[I]]
expression = SKICall.new(function, y)
=> S[S[K[S]][I]][K[I]][y]
while expression.reducible?
  puts expression
  expression = expression.reduce
end; puts expression
S[S[K[S]][I]][K[I]][y]
S[K[S]][I][y][K[I][y]]
K[S][y][I[y]][K[I][y]]
S[I[y]][K[I][y]]
S[y][K[I][y]]
S[y][I]
expression == original
=> false
</code>

It looks like the function behavior, just putting the value in the place to do something, like an argument. This makes it straightforward to translate lambda calculus expressions into SKI expressions.

<code>
class LCVariable
  def to_ski
    SKISymbol.new(name)
  end
end
<br>
class LCCall
  def to_ski
    SKICall.new(left.to_ski, right.to_ski)
  end
end
<br>
class LCFunction
  def to_ski
    body.to_ski.as_a_function_of(parameter)
  end
end
</code>

Let's check this translation:

<code>
two = LambdaCalculusParser.new.parse('-> p { -> x { p[p[x]] } }').to_ast
=> -> p { -> x { p[p[x]] } }
two.to_ski
=> S[S[K[S]]S[K[K]][I]][S[S[K[S]][S[K[K]][I]]][K[I]]]
</code>

#### Iota

The Greek letter iota (ɩ) is an extra combinator, it can be added to the SKI combinator. Iota's reduction rule is: ɩ[a] to a[S][K].

We can try to implement iota on our SKI calculus implementation:

<code>
IOTA = SKISymbol.new('ɩ')
<br>
def IOTA.call(a)
  SKICall.new(SKICall.new(a, S), K)
end
<br>
def IOTA.callable?(*arguments)
  arguments.length == 1
end
</code>


Chris Barker proposer a language called Iota whose programs only use ɩ combinator. Even with only one combinator, Iota is universal, because any SKI calculus expression can be converted into it, and we saw that SKI calculus is universal.

We can convert an SKI expression to Iota using these rules:

- Replace S with ɩ[ɩ[ɩ[ɩ[ɩ]]]].
- Replace K with ɩ[ɩ[ɩ[ɩ]]].
- Replace I with ɩ[ɩ].

It's easy to implement this conversion:

<code>
class SKISymbol
  def to_iota
    self
  end
end
<br>
class SKICall
  def to_iota
    SKICall.new(left.to_iota, right.to_iota)
  end
end
<br>
def S.to_iota
  SKICall.new(IOTA, SKICall.new(IOTA, SKICall.new(IOTA, SKICall.new(IOTA, IOTA))))
end
<br>
def K.to_iota
  SKICall.new(IOTA, SKICall.new(IOTA, SKICall.new(IOTA, IOTA)))
end
<br>
def I.to_iota
  SKICall.new(IOTA, IOTA)
end
</code>

But we wonder ourselves, why this is like this? So, we're going to see why, by converting the Iota expressions to SKI calculus again:

<code>
expression = S.to_iota
=> ɩ[ɩ[ɩ[ɩ[ɩ]]]]
ɩ[ɩ[ɩ[ɩ[ɩ]]]]
ɩ[ɩ[ɩ[ɩ[S][K]]]]
ɩ[ɩ[ɩ[S[S][K][K]]]]
ɩ[ɩ[ɩ[S[K][K[K]]]]]
ɩ[ɩ[S[K][K[K]][S][K]]]
ɩ[ɩ[K[S][K[K][S]][K]]]
ɩ[ɩ[K[S][K][K]]]
ɩ[ɩ[S[K]]]
ɩ[S[K][S][K]]
ɩ[K[K][S[K]]]
ɩ[K]
K[S][K]
S
<br>
expression = K.to_iota
=> ɩ[ɩ[ɩ[ɩ]]]
ɩ[ɩ[ɩ[ɩ]]]
ɩ[ɩ[ɩ[S][K]]]
ɩ[ɩ[S[S][K][K]]]
ɩ[ɩ[S[K][K[K]]]]
ɩ[S[K][K[K]][S][K]]
ɩ[K[S][K[K][S]][K]]
ɩ[K[S][K][K]]
ɩ[S[K]]
S[K][S][K]
K[K][S[K]]
K
<br>
expression = I.to_iota
=> ɩ[ɩ]
ɩ[ɩ]
ɩ[S][K]
S[S][K][K]
S[K][K[K]]
</code>

We can see that S and K when are converted to SKI calculus, become the combinator, but with I is different, it's clear that "S[K][K[K]]" isn't syntactically equal to I, but it's another example of an expression that uses the S and K combinators to do the same thing as I:

<code>
identity = SKICall.new(SKICall.new(S, K), SKICall.new(K, K))
=> S[K][K[K]]
expression = SKICall.new(identity, x)
=> S[K][K[K]][x]
while expression.reducible?
  puts expression
  expression = expression.reduce
end; puts expression
S[K][K[K]][x]
K[x][K[K][x]]
K[x][K]
x
</code>

So the translation into Iota does preserver the individual behavior of all three SKI combinators, but doesn't preserve their syntax.

{% for author in site.data.author%}
In the next post, we're going to see more universal systems. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
