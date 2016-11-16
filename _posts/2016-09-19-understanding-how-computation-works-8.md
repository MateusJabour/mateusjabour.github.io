---
layout: posts
title: "Understanding how computation works part 8"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going learn about an abstract way of programming, useful for testing if a program's going to execute right."
homeImage: "/assets/img/understanding-how-computation-works-8.jpg"
type: post
permalink: understanding-how-computation-works-8
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

We know that every programming language has it own syntax, which we use it to communicate ideas to a machine, creating programs. Sometimes we need those programs to deal with informations that we won't know until run time, like an interation with user, files passed as arguments, data read from network, etc. We can try to test those programs with dummy inputs, but, using this way to test the program, we won't know the its behavior with  the real input. We can try to execute it with lots of inputs, however, it won't be enough.

Other problem that we can find, is that a program written in a powerful language(universal) is capable of running forever, being impossible to investigate does kind of behavior, and I didn't mentioned the time that you would spend with every test, remember, time is money. :p

We need a way of discover some informations about this program without actually running it. We could use abstract interpretation, an analysis technique in which we execute a simplified version of the program and use the result to deduce properties of the original.

#### Abstract Interpretation

Abstract interpretation gives us a way of approaching a complex problem, without going into its complexity, by creating abstractions, discarding enough details to make it manageable. Let's look a application of abstract interpretation, so we can make this idea more concrete.

#### Abstraction: Multiplying Signs

So, how mission is to discover what is the sign of a multiplication without performing it, for example:

<code>
6 * -9
=> -54
</code>

We know that when we multiply two numbers with the same signs, the result is positive, but, if we multiply two numbers with different signs, the result is negative, like in the case above. But, we could abstract the numbers, so, we have our answer without performing the absolute mulplication. We will need to use abstract interpretation for this.

So, let's try to use three kind of numbers in out abstraction: negative, zero and positive. We can build Ruby classes to represent our program, let's do it:

<code>
class Sign < Struct.new(:name)
  NEGATIVE, ZERO, POSITIVE = [:negative, :zero, :positive].map { |name| new(name)  }
<br>
  def inspect
    "#&lt;Sign #{name}&gt;"
  end
end
</code>

Now, we can represent the abstract values: Sign::NEGATIVE for "any negative number", Sign::ZERO for "the number zero", Sign::POSITIVE for "any positive number". Just those 3 objects compose out tiny abstract world where we'll abstract calculation. We can define the abstract multiplication for Sign value:

<code>
class Sign
  def *(other_sign)
    if[self, other_sign].include?(ZERO)
      ZERO
    elsif self == other_sign
      POSITIVE
    else
      NEGATIVE
  end
end
</code>

It will give us just the sign of a multiplication:

<code>
Sign::POSITIVE * Sign::POSITIVE
=> #&lt;Sign positive&gt;
Sign::NEGATIVE * Sign::ZERO
=> #&lt;Sign zero&gt;
Sign::POSITIVE * Sign::NEGATIVE
=> #&lt;Sign negative&gt;
</code>

Now, we need to convert the number into the abstract form, just its sign, and multiply those signs to find out what is the result sign.

<code>
class Numeric
  def sign
    if self < 0
      Sign::NEGATIVE
    elsif zero?
      Sign::ZERO
    else
      Sign::POSITIVE
    end
  end
end
</code>

Now, we can convert two numbers and multiply them in the abstract world:

<code>
6.sign
=> #&lt;Sign positive&gt;
-9.sign
=> #&lt;Sign negative&gt;
6.sign * -9.sign
=> #&lt;Sign negative&gt;
</code>

We figured out that the product of 6 * -9 its negative without performing the real multiplication. But, the abstract result Sign::NEGATIVE just tell us that any negative number is the answer to 6 * -9, but it excludes the possibility of the answer be - or 1 or 500 and so on.

Note that, because Ruby values are objects we can use the same Ruby expression to perfom either a concrete or an abstract computation depeding on whether we provide concrete or abstract object as arguments, take #calculate as an example:

<code>
def calculate(x, y, z)
  (x * y) * (x * z)
end
</code>

If we call #calculate with Fixnum objects, the calcutation will provide us Fixnum, but, if we can #calculate with Sign, it will provide us Sing in reutnr.

<code>
calculate(3, -5, 0)
=> 0
calculate(Sign::POSITIVE, Sign::NEGATIVE, Sign::ZERO)
=> #&lt;Sign zero&gt;
</code>

#### Safety and Approximation: Adding Signs

So far we've seen that a computation in the abstract world will produce less precise results than its concrete counterpart, throwing away details. A lot of times, it's fine to have imprecision in results provided by abstractions, but, those imprecisions must be safe, so the abstraction becomes useful. But, what is safety in the abstract world? Safety means that the abstraction always tells the truth.

We can notice that out Sign abstraction is safe because converting numbers into Signs and multiplying them together always gives us the same result.

<code>
(6 * -9).sign == (6.sign * -9.sign)
=> true
(100 * 0).sign == (100.sign * 0.sign)
=> true
calculate(1, -2, -3).sign == calculate(1.sign, -2.sign, -3.sign)
=> true
</code>

We can see that those analysis are quite precise, it gives us the exactly result that our abstraction needs. The safety issue becomes more significant when the abstraction doesn't match ujp quite so perfectly, for example the addition case.

There are some rules taht can help us implement an abstraction of addition, but, they don't work for all combinations of sign. We know that adding numbers of the same sign, will result in a number with the same sign, and if you add a number with zero, the result will have the sign of the not zero number. But, if we take an additions of two numbers with different signs? We would need the absolute value of each number to know which sign the result would have. In the abstraction world, we know that we don't use absolute values, so, we can't have a precise answer in this case.

This is a problem for our abstraction: it's so abstract that it isn't able to compute addition accurately in every situation. The only way to solve this imprecision is to implement a new value called Sign::UNKNOWN:

<code>
class Sign
  UNKNOWN = new(:unknown)
end
</code>

This give us a way to implement abstract addition safely. Let's implement Sign#+ now:

<code>
class Sign
  def +(other_sign)
    if self == other_sign || other_sign == ZERO
      self
    elsif self == ZERO
      other_sign
    else
      UNKNOWN
    end
  end
end
</code>

That gives us what we need:

<code>
Sign::POSITIVE + Sign::POSITIVE
=> #&lt;Sign positive&gt;
Sign::NEGATIVE + Sign::ZERO
=> #&lt;Sign negative&gt;
Sign::POSITIVE + Sign::NEGATIVE
=> #&lt;Sign unknown&gt;
</code>

And, when we use Sign::UNKNOWN as input, our implementation knows how to deal with it:

<code>
Sign::POSITIVE + Sign::UNKNOWN
=> #&lt;Sign unknown&gt;
Sign::UNKNOWN + Sign::ZERO
=> #&lt;Sign unknown&gt;
Sign::POSITIVE + Sign::NEGATIVE + Sign::NEGATIVE
=> #&lt;Sign unknown&gt;
</code>

We need to fix out implementation of Sign#* to handle the UNKNOWN value:

<code>
class Sign
  def *(other_sign)
    if [self, other_sign].include?(ZERO)
      ZERO
    elsif [self, other_sign].include?(UNKNOWN)
      UNKNOWN
    elsif self == other_sign
      POSITIVE
    else
      NEGATIVE
    end
  end
end
</code>

You can notice that, even a UNKNOWN value multiplied by zero, is still zero, so, we can conclude that UNKNOWN isn't that contagious. Let's mix Sign#* with Sign#+ and see what happens:

<code>
(Sign::POSITIVE + Sign::NEGATIVE) * Sign::ZERO + Sign::POSITIVE
=> #&lt;Sign positive&gt;
</code>

We need to adjust the idea of correctness to deal with the impression introduced by Sign::UNKNOWN. We know that our abstraction sometimes will fail in giving precise answer, due to the lack of information, like this one:

<code>
(10 + 3).sign == (10.sign + 3.sign)
=> true
-5 + 0).sign == (-5.sign + 0.sign)
=> true
(6 + -9).sign == (6.sign + -9.sign)
=> false
(6 + -9).sign
=> #&lt;Sign negative&gt;
6.sign + -9.sign
=> #&lt;Sign unknown&gt;
</code>

So, did our abstraction lose safety? No, because when it returns UNKNOWN, it still says to us that the result is "negative, zero or positive". We need to agree that isn't useful as the other result, but isn't wrong.

There's a question that can open a discussion for us: Does the result of the concrete computation fall within the result predicted by the abstract one? If the abstract computation says that a few different results are possible, does the concrete computation actually produce on of those results, or something else?

Let's implement Sign#<= and see what happens:

<code>
class Sign
  def <=(other_sign)
    self == other_sign || other_sign == UNKNOWN
  end
end
</code>

And this give us the test we want:

<code>
Sign::POSITIVE <= Sign::POSITIVE
=> true
Sign::POSITIVE <= Sign::UNKNOWN
=> true
Sign::POSITIVE <= Sign::NEGATIVE
=> false
</code>

Now, we can test whether each concrete computation's result falls within the abstract computation's predict:

<code>
(6 * -9).sign <= (6.sign * -9.sign)
=> true
(-5 + 0).sign <= (-5.sign + 0.sign)
=> true
(6 + -9).sign <= (6.sign + -9.sign)
=> true
</code>

Now, we've designed an abstraction that falls back to a safe approximation when it can't give a precise answer. We can do simple analysis of Ruby code that adds and multiplies numbers, we can use the sums of squares as example:

<code>
def sum_of_squares(x, y)
  (x * x) + (y * y)
end
</code>

Each of the arguments x and y can be negative, zero and positive numbers, let's see the outputs:

<code>
Sign.rb(main):116:0* inputs = Sign::NEGATIVE, Sign::ZERO, Sign::POSITIVE
=> [#&lt;Sign negative&gt; #&lt;Sign zero&gt; #&lt;Sign positive&gt;
Sign.rb(main):117:0> outputs = inputs.product(inputs).map { |x, y| sum_of_squares(x, y) }
=> [#&lt;Sign positive&gt; #&lt;Sign positive&gt; #&lt;Sign positive&gt; #&lt;Sign positive&gt; #&lt;Sign zero&gt; #&lt;Sign positive&gt; #&lt;Sign positive&gt; #&lt;Sign positive&gt; #&lt;Sign positive&gt;
Sign.rb(main):118:0> outputs.uniq
=> [#&lt;Sign positive&gt; #&lt;Sign zero&gt;
</code>

With this analysis, we've discovered that the sum of squares can only produce zero or positive numbers, never negative numbers. Of course that this trick will only work with very simple code, but despite being a toy, it shows how abstractions can make a difficult problem more tractable.

#### Static Semantics

So far we've seen toy examples of how to discover approximate information about computation without actually perfoming them. We can learn more by using computation for real, we can answer more question about a specific program just by using its Static Semantic, but, what is the Static Semantic of a program? It tells us about properties of this program that we can investigate without executing it. One classic example of static syntax is the type system. We could try to get the types of each value in a program, and see if everything is running as it should. Let's use Simple, the language that we had implemented in our first post. Let's remember what we could build with it:

<code>
expression = Add.new(Variable.new(:x), Number.new(1))
=> x + 1
expression.evaluate({ x:Number.new(2) })
=> 3
statement = Assign.new(:y, Number.new(3))
=> y = 3
statement.evaluate({ x: Number.new(1) })
=> {:x=>1, :y=>3}
</code>

So, we're going to abstract everything that isn't type, a type can represent many possible values, like "any number" or "any Boolean". Let's define our Type class:

<code>
class Type < Struct.new(:name)
  NUMBER, BOOLEAN = [:number, :boolean].map { |name| new(name) }
<br>
  def inspect
    "#&lt;Type #{name}&gt;"
  end
end
</code>

So, we need to implement #type for each class that represent an expression in Simple(number, if's, while's, etc). Let's start with the more basics classes:

<code>
class Number
  def type
    Type::NUMBER
  end
end
<br>
class Boolean
  def type
    Type::BOOLEAN
  end
end
</code>

For Add, Multiply and LessThan is a little bit more complicated, those expressions will only succeed if both arguments are numbers. otherwise, Simple interpreter will fail:

<code>
Add.new(Number.new(1), Number.new(2)).evaluate({})
=> 3
Add.new(Number.new(1), Boolean.new(true)).evaluate({})
TypeError: true can't be coerced into Fixnum
</code>

So, for implement #type for those 3, we need to think about the rules of each one. For Add, if the type of both arguments is NUMBER, the result will return NUMBER, otherwise, the result is no type. We can let #type returning nil for those fail situations. For Multiply is identical to Add, and LessThan is very similar, expect that it returns BOOLEAN.

<code>
class Add
  def type
    if left.type == Type::NUMBER && right.type == Type::NUMBER
      Type::NUMBER
    end
  end
end
<br>
class LessThan
  def type
    if left.type == Type::NUMBER && right.type == Type::NUMBER
      Type::BOOLEAN
    end
  end
end
</code>

We can cases that expressions will evaluate successfully, and those that won't.

<code>
Add.new(Number.new(1), Number.new(2)).type
=> #&lt;Type number&gt;
Add.new(Number.new(1), Boolean.new(true)).type
=> nil
LessThan.new(Number.new(1), Number.new(2)).type
=> #&lt;Type boolean&gt;
LessThan.new(Number.new(1), Boolean.new(true)).type
=> nil
</code>

We're getting there. Let's not forget the Variable class, but, what should Variable#type return? It depends what value the variable contains. We can use the same thinking of environment to store the variables values that we used on the first post, when we saw "Small-step semantics", but, to distinguish from the concrete computation, we're going to use the name "context":

<code>
class Variable
  def type(context)
    context[name]
  end
end
</code>

And now, we'll need to use "context" on all the #type implementation:

<code>
class Number
  def type(context)
    Type::NUMBER
  end
end
<br>
class Boolean
  def type(context)
    Type::Boolean
  end
end
<br>
class Add
  def type(context)
    if left.type(context) == Type::NUMBER && right.type(context) == Type::NUMBER
      Type::NUMBER
    end
  end
end
<br>
class LessThan
  def type(context)
    if left.type(context) == Type::NUMBER && right.type(context) == Type::NUMBER
      Type::BOOLEAN
    end
  end
end
</code>

Now, we can ask for the type, but we need to provide the context:

<code>
expression = Add.new(Variable.new(:x), Variable.new(:y))
=> x + y
expression.type({})
=> nil
expression.type({ x: Type::NUMBER, y: Type::NUMBER })
=> #&lt;Type number&gt;
expression.type({ x: Type::NUMBER, y: Type::BOOLEAN })
=> nil
</code>

For statements, the best way is to treat them as a king of inert expression: assume that they don't return a value (which is true) and ignore the effect they have on the environment. We can create the VOID value, that means "doens't return a value" and associate to those statements:

<code>
class Type
  VOID = new(:void)
end
</code>

We can use VOID to implement DoNothing and Sequence. Those are easy, first that DoNothing will always succeed, and Sequence will succeed if there's nothing wrong with the statement:

<code>
class DoNothing
  def type(context)
    Type::VOID
  end
end
<br>
class Sequence
  def type(context)
    if first.type(context) == Type::VOID && second.type(context) == Type::VOID
      Type::VOID
    end
  end
end
</code>

For If and While, the only specific thing that we need to set is that the condition needs to be evaluated to a Boolean:

<code>
class If
  def type(context)
    if condition.type(context) == Type::BOOLEAN &&
      consequence.type(context) == Type::VOID &&
      alternative.type(context) == Type::VOID
      Type::VOID
    end
  end
end
<br>
class While
  def type(context)
    if condition.type(context) == Type::BOOLEAN && body.type(context) == Type::VOID
      Type::VOID
    end
  end
end
</code>

This will let us know when a statement will go wrong or not:

<code>
If.new(
  LessThan.new(Number.new(1), Number.new(2)), DoNothing.new, DoNothing.new
).type({})
=> #&lt;Type void&gt;
If.new(
  Add.new(Number.new(1), Number.new(2)), DoNothing.new, DoNothing.new
).type({})
=> nil
While.new(Variable.new(:x), DoNothing.new).type({ x: Type::BOOLEAN })
=> #&lt;Type void&gt;
While.new(Variable.new(:x), DoNothing.new).type({ x: Type::NUMBER })
=> nil
</code>

The only method to implement now is Assign#type. We know it should return Type::VOID, but under what circumstances? How do we decide if an assignment is well-behaved or not? We will need to make some design decisions about what should be considered valid Simple programs. In those decisions we have a tension between the restrictiveness of a type system and the expressiveness of the programs we can write within it. It would be very complex to implement something deeper than what we're doing now, so, let's stick with the uncomplicated idea of a type context that's provided by something outside the program ifself and doesn't get updated by individual statement. Let's say that the type of the expression should match the type of the variable to which its value is being assigned:

<code>
class Assign
  def type(context)
    if context[name] == expression.type(context)
      Type::VOID
    end
  end
end
</code>

Let's test everything with a While loop whose dynamic semantics we implemented in our first post:

<code>
statement =
  While.new(
    LessThan.new(Variable.new(:x), Number.new(5)),
    Assign.new(:x, Add.new(Variable.new(:x), Number.new(3)))
  )
=> while (x < 5) { x = x + 3 }
statement.type({})
=> nil
statement.type({ x: Type::NUMBER })
=> #&lt;Type void&gt;
statement.type({ x: Type::BOOLEAN })
=> nil
</code>


#### Benefits and Limitations

Type system implementation can prevent basic errors. By running a toy version of a program according to these static semantics, we can find out what types of value can appear at each point in the original program and check if these types matches with what the dynamic semantics is going to try to do. For example, we can check a program that runs forever.

<code>
statement = Sequence.new(
  Assign.new(:x, Number.new(0)),
  While.new(
    Boolean.new(true),
    Assign.new(:x, Add.new(Variable.new(:x), Number.new(1)))
  )
)
=> x = 0; while (true) { x = x + 1 }
statement.type({ x: Type::NUMBER })
=> #&lt;Type void&gt;
statement.evaluate({})
SystemStackError: stack level too deep
</code>

This program is stupid, but it doesn't conatin any type errors. Of course, the type system isn't clever enough to tell us whether a pgoram is doing what we meant it to do, or even doing anything useful. only whether its parts match up in the right way. Because of the safety, sometimes it will give us an overly pessimistic answer about whether the program contains any errors. One example of this is this one:

<code>
statement = Sequence.new(statement, Assign.new(:x, Boolean.new(true)))
=> x = 0; while (true) { x = x + 1 }; x = true
statement.type({ x: Type::NUMBER})
=> nil
</code>

It just returns a nil value because x is receiving a Boolean as it value, but there's no way this could actually cause a problem. We can see that not just infinite loops cause problems:

<code>
statement =
  Sequence.new(
    If.new(
      Variable.new(:b),
      Assign.new(:x, Number.new(6)),
      Assign.new(:x, Boolean.new(true))
    ),
    Sequence.new(
      If.new(
        Variable.new(:b),
        Assign.new(:y, Variable.new(:x)),
        Assign.new(:y, Number.new(1))
      ),
      Assign.new(:z, Add.new(Variable.new(:y), Number.new(1)))
    )
  )
=> if (b) { x = 6 } else { x = true }; if (b) { y = x } else { y = 1 }; z = y + 1
statement.evaluate({ b: Boolean.new(true) })
=> {:b=>true, :x=>6, :y=>6, :z=>7}
statement.evaluate({ b: Boolean.new(false) })
=> {:b=>false, :x=>true, :y=>1, :z=>2}
</code>

We can see that there's no way of x to get both a Boolean and a Number value in the same execution. But, to be safe, the approximation prefer to say "this program might go wrong":

<code>
Type.rb(main):188:0* statement.type({})
=> nil
Type.rb(main):189:0> context = { b: Type::BOOLEAN, y: Type::NUMBER, z: Type::NUMBER }
=> {:b=>#&lt;Type boolean&gt;, :y=>#&lt;Type number&gt;, :z=>#&lt;Type number&gt;}
Type.rb(main):190:0> statement.type(context)
=> nil
Type.rb(main):191:0> statement.type(context.merge({ x: Type::NUMBER }))
=> nil
Type.rb(main):192:0> statement.type(context.merge({ x: Type::BOOLEAN }))
=> nil
</code>

{% for author in site.data.author%}
In the next post, we're going to see more about the last hint of testing your code. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
