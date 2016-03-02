---
layout: posts
title: "Understanding how computation works part 1"
summary: "So, on this post, I will try to make you understand more about computer science. So, to start the post, I will talk about the meaning of programs."
homeImage: "/assets/img/understanding-how-computation-works-1.png"
type: post
permalink: understanding-how-computation-works-1
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

So, on this post, I will try to make you understand more about computer science. So, to start the post, I will talk about the meaning of programs.

First of all, computer science isn't about programs, it's about ideas, we use programming languages to make those ideas clear in our mind, and the program is the representation of the idea out of our minds. In linguistics, semantics is the connection between the word and it meaning, in computer science, there is a field called "formal semantics", that is concerned with finding ways to discover the meaning of programs and using it to discover great things in programming.

So, we can conclude that, to specify a programming language, we need to provide two things: syntax and semantics, one to describe how the program going to look like, and the other to describe the meaning of the program.

Talking more about syntax, every programming language has their rules, what is valid or not on this programming language, this is syntax, for example, we can type some non-sense code on Ruby, like "Xz=d+=d", this will bring us an error in Ruby, a syntaxError, but, if I type "x = 5", no error will be shown. But the question is, why does programming languages need syntax? Because programming language is the one who makes the computer understand what you want the program to do, it is the parser of your code to the machine language.

So, to start understanding more, I introduce you the "Operational Semantics", that is a way to capture the meaning of a programming language by defining rules, executed by a device, in our case a abstract machine. For a operational semantics, we need to be rigorous and precise about the purpose of particular constructs in the language, avoiding ambiguities.

So, the question is, how we are going to design our abstract machine? There are many ways to do it, but first, we will use the "small-steps semantics", that consists in the machine evaluating the program and reducing it in small steps, giving you the step-by-step and the final result. We are going to use Ruby to design this abstract machine.

Let's start building this abstract machine by it expressions. Let call the abstract machine by "SIMPLE". So we can define those expression by using Ruby classes. Let's start with "Add", "Number" and "Multiply".

<code>
class Number &lt; Struct.new(:value)
end
<br>
class Add &lt; Struct.new(:left, :right)
end
<br>
class Multiply &lt; Struct.new(:left, :right)
end
</code>

The idea is to make this:

<code>
    Add.new(
        Multiply.new(Number.new(1), Number.new(2))
        Multiply.new(Number.new(3), Number.new(4))
    )
</code>

Have the meaning of: "(1 * 2) + (3 * 4)"

To reach this, first, we need to show what this amount of code means, just by defining the "to_s" and "inspect" from each object.

<code>
class Number < Struct.new(:value)
    def to_s
        value.to_s
    end
<br>
    def inspect
        "#{self}"
    end
end
<br>
class Add < Struct.new(:left, :right)
    def to_s
        "#{left} + #{right}"
    end
<br>
    def inspect
        "#{self}"
    end
end
<br>
class Multiply < Struct.new(:left, :right)
    def to_s
        "#{left} * #{right}"
    end
    <br>
    def inspect
        "#{self}"
    end
end
</code>

Than, we need to reduce those expression until we get the final result, but first, we need to know if we really need to reduce tha expression or if the expression is already the result, so, creating a "reducible?" method, we can know what situation the expression it is.

<code>
Class Number
    def reducible?
        false
    end
end
<br>
Class Add
    def reducible?
        true
    end
end
<br>
Class Multiply
    def reducible?
        true
    end
end    
</code>

Now that we know if the expression is reducible or not, let's implement the reduce method, but, what are the rules for the reduction? And if the left or right side of the expression is reducible too? Making those questions we can reach at a good implementation, we can check if each side is reducible or not, if it is, return the expression with the side reduced, and we keep doing this until the expression is all reduced.

<code>
class Add
    def reduce
        if left.reducible?
            Add.new(left.reduce, right)
        elsif right.reducible?
            Add.new(left, right.reduce)
        else
            Number.new(left.value + right.value)
        end
    end
end
<br>
class Multiply
    def reduce
        if left.reducible?
            Multiply.new(left.reduce, right)
        elsif right.reducible?
            Multiply.new(left, right.reduce)
        else
            Number.new(left.value * right.value)
        end
    end
end
</code>

So, it is obvious that we need to call reduce several times to obtain the final result, but we wouldn't do it manually, right? So, let's implement a virtual machine for us to do this. The machine can be a class that has 2 classes, one is a step, just to reduce the expression, the other is the run, to make the necessary loops and output the step-by-step of the expression.

<code>
class Machine < Struct.new(:expression)
    def step
        self.expression = expression.reduce
    end
<br>
    def run
        while expression.reducible?
            puts expression
            step
        end
        puts expression
    end
end
</code>

Now, let's run this machine on a expression:

<code>
    Machine.new(
        Add.new(
            Multiply.new(Number.new(1), Number.new(2))
            Multiply.new(Number.new(3), Number.new(4))
        )
    ).run
    1 * 2 + 3 * 4
    2 + 3 * 4
    2 + 12
    14
    nil
</code>

So, looks easy, no? Let's implement a boolean expression, the "less than", for this, we need to create towo objects, the boolean itself and the less than.

<code>
class Boolean < Struct.new(:value)
    def to_s
        value.to_s
    end
    <br>
    def reducible?
        false
    end
<br>
    def inspect
        "#{self}"
    end
end
<br>
class LessThan < Struct.new(:left, :right)
    def to_s
        "#{left} < #{right}"
    end
    <br>
    def reducible?
        true
    end
<br>
    def reduce
        if left.reducible?
            LessThan.new(left.reduce, right)
        elsif right.reducible?
            LessThan.new(left, right.reduce)
        else
            Boolean.new(left.value < right.value)
        end
    end
<br>
    def inspect
        "#{self}"
    end
end
</code>

This allow us to reduce a boolean expression in small steps. Let's see how it's working:

<code>
Machine.new(
    LessThan.new(Number.new(5), Add.new(Number.new(2), Number.new(2)))
).run
5 < 2 + 2
5 < 4
false
nil
</code>

Now, SIMPLE just has simple algebraic expressions, this isn't so interesting, we need to create a new object, the variables.

<code>
class Variable < Struct.new(:name)
    def to_s
        name.to_s
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def reducible?
        true
    end
end
</code>

And to reduce a variable it is simple, just replace the variable name by it value:

<code>
class Variable
    def reduce(environment)
        environment[name]
    end
end
</code>

After introducing the variables on SIMPLE, we need to keep the variable's name and value, we need to keep it on a environment, that can be a Ruby hash. Now, we need to change some methods.

<code>
class Add
    def reduce(enviroment)
        if left.reducible?
            Add.new(left.reduce(enviroment), right)
        elsif right.reducible?
            Add.new(left, right.reduce(environment))
        else
            Number.new(left.value + right.value)
        end
    end
end
<br>
class Multiply
    def reduce(enviroment)
        if left.reducible?
            Multiply.new(left.reduce(enviroment), right)
        elsif right.reducible?
            Multiply.new(left, right.reduce(environment))
        else
            Number.new(left.value * right.value)
        end
    end
end
<br>
class LessThan
    def reduce(enviroment)
        if left.reducible?
            LessThan.new(left.reduce(enviroment), right)
        elsif right.reducible?
            LessThan.new(left, right.reduce(enviroment))
        else
            Boolean.new(left.value < right.value)
        end
    end
end
</code>

Look that we've only put the environment as a argument on each reduce method, after this, we need to change the Machine object to have a environment instance variable, because everytime the step method is called, it need to have the environment to reduce the expression, so...

<code>
class Machine < Struct.new(:expression, :enviroment)
    def step
        self.expression = expression.reduce(enviroment)
    end
<br>
    def run
        while expression.reducible?
            puts expression
            step
        end
        puts expression
    end
end
</code>

Now that we have a environment to keep all our variables, our operational semantics is complete.

We can now look at an different kind of implemetation, it is called statement, different from the expressions, statement doesn't produce another expression, instead of this, statement is evaluated to make changes on the state of the abstract machine, to update the state of it, the environment is a state, the only one on SIMPLE, so, let's allow SIMPLE to produce a new environment to replace the current one.

Let's create a object called DoNothing, that can't be reduced and there is no effect, the name already explain what it does.

<code>
class DoNothing
    def to_s
        'do-nothing'
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def ==(other_statment)
        other_statment.instance_of?(DoNothing)
    end
<br>
    def reducible?
        false
    end
end
</code>

This class seems to be useless, but DoNothing will help us to represent that the execution is complete and successful.

Now, let's create the assigment expression, this one will help us to populate the environment with a lot of new variables and values for them.

But, how we can reduce a assigment? Let's think about the assigment flow: the right side will be evaluated, reduced until there isn't any reducible expression, then the right side result will be "assigned" to the left side variable, and finally put on the environment, after that, nothing happens. Look that "nothing happens" can be translated to "DoNothing" semantics, with this, let's implement the assigment class.

<code>
class Assign < Struct.new(:name, :expression)
    def to_s
        "#{name} = #{expression}"
    end
    <br>
    def inspect
        "#{self}"
    end
    <br>
    def reducible?
        true
    end
    <br>
    def reduce(enviroment)
        if expression.reducible?
            [Assign.new(name, expression.reduce(enviroment)), enviroment]
        else
            [DoNothing.new, enviroment.merge({ name => expression })]
        end
    end
end
</code>

Now that we are returning a new environment from the assignment, we will need to reimplement the Machine to receive the new environment:

<code>
class Machine < Struct.new(:statement, :enviroment)
    def step
        self.statement, self.enviroment = statement.reduce(enviroment)
    end
<br>
    def run
        while statement.reducible?
            puts "#{statement}, #{enviroment}"
            step
        end
<br>
        puts "#{statement}, #{enviroment}"
    end
end
</code>

Now we have the environment update everytime that the assignment ends. Let's see what happens when we run it:

<code>
Machine.new(
    Assign.new(:x, Add.new(Variable.new(:x), Number.new(1))),
    { x: Number.new(2) }
)
x = x + 1, {:x=>2}
x = 2 + 1, {:x=>2}
x = 3, {:x=>2}
do-nothing, {x=>3}
nil
</code>

NOw, let's try to implement a If statement, let's remember how a 'if' works. We have the condition, the consequence and the alternative(else), if the condition is true, execute the consequence, else, execute the alternative. Now, thinking about SIMPLE, first of all we will need to reduce the condition before evaluating it, then, if true, reduce to the consequence, else, reduce to the alternative., both don't change the environment.

<code>
class If < Struct.new(:condition, :consequence, :alternative)
    def to_s
        "if (#{condition}) { #{consequence} } else { #{alternative} }"
    end
<br>
    def inspect
        "#{self}"
    end
    def reducible?
        true
    end
<br>
    def reduce(enviroment)
        if condition.reducible?
            [If.new(condition.reduce(enviroment), consequence, alternative), enviroment]
        else
            case condition
            when Boolean.new(true)
                [consequence, enviroment]
            when Boolean.new(false)
                [alternative, enviroment]
            end
        end
    end
end
</code>

Now, look how it works:

<code>
Machine.new(
    If.new(
        Variable.new(:x),
        Assign.new(:y, Number.new(1)),
        Assign.new(:y, Number.new(2))
    ),
    { x: Boolean.new(true) }
)
if (x) { y = 1 } else { y = 2 }, {:x=>true}
if (true) { y = 1 } else { y = 2 }, {:x=>true}
y = 1, {:x=>true}
do-nothing, {:x=>true, :y=>1}
nil
</code>

If you want to use a if statement withou the else, just pass as the alternative a "do-nothing".

What about sequences of expressions? How could we implement this on the small-steps semantics? So, first we need to define the evaluation order, almost everytime, the evaluation is from the left to the right, so, having this in mind, we can say that is basically evaluate the first expression, if it is reducible, do it and return the new environment, if it is a do-nothing, reduce the second until it becomes a do-nothing and return the new envirionment too. Let's do it.

<code>
class Sequence < Struct.new(:first, :second)
   def to_s
        "#{first}; #{second}"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def reducible?
        true
    end
<br>
    def reduce (enviroment)
        case first
        when DoNothing.new
            [second, enviroment]
        else
            reduced_first, reduced_enviroment = first.reduce(enviroment)
            [Sequence.new(reduced_first, second), reduced_enviroment]
        end
    end
end
</code>

Let's run it on the Machine to see what I said above happening:

<code>
Machine.new(
    Sequence.new(
        Assign.new(:x, Add.new(Number.new(1), Number.new(1))),
        Assign.new(:y, Add.new(Variable.new(:x), Number.new(3)))
    ),
    {}
)
x = 1 + 1; y = x + 3, {}
x = 2; y = x + 3, {}
do-nothing; y = x + 3, {:x => 2}
y = x + 3, {:x => 2}
y = 2 + 3, {:x => 2}
do-nothing, {:x => 2, :y => 5}
nil
</code>

To finish our SIMPLE implementation, let's implement while, a looping statement. So, to implement while, we will need to use if statement to represent the while condition, the if consequence will be a sequence, the first expression will be the assigment, that represents the while body being executed and updating the environment, the second expression will be the while, that will use the updated environment, this if will be repeat until the condition becomes false.

<code>
class While < Struct.new(:condition, :body)
    def to_s
        "while (#{condition}) { #{body} }"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def reducible?
        true
    end
<br>
    def reduce(enviroment)
        [If.new(condition, Sequence.new(body, self), DoNothing.new), enviroment]
    end
end
</code>

Let's run it:

<code>
Machine.new(
    While.new(
        LessThan.new(Variable.new(:x), Number.new(5)),
        Assign.new(:x, Multiply.new(Variable.new(:x), Number.new(3)))
    ),
    { x: Number.new(1) }
).run
while (x < 5) { x = x * 3 }, {:x=>1}
if (x < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>1}
if (1 < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>1}
if (true) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>1}
x = x * 3; while (x < 5) { x = x * 3 }, {:x=>1}
x = 1 * 3; while (x < 5) { x = x * 3 }, {:x=>1}
x = 3; while (x < 5) { x = x * 3 }, {:x=>1}
do-nothing; while (x < 5) { x = x * 3 }, {:x=>3}
while (x < 5) { x = x * 3 }, {:x=>3}
if (x < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>3}
if (3 < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>3}
if (true) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>3}
x = x * 3; while (x < 5) { x = x * 3 }, {:x=>3}
x = 3 * 3; while (x < 5) { x = x * 3 }, {:x=>3}
x = 9; while (x < 5) { x = x * 3 }, {:x=>3}
do-nothing; while (x < 5) { x = x * 3 }, {:x=>9}
while (x < 5) { x = x * 3 }, {:x=>9}
if (x < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>9}
if (9 < 5) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>9}
if (false) { x = x * 3; while (x < 5) { x = x * 3 } } else { do-nothing }, {:x=>9}
do-nothing, {:x=>9}
 => nil 
</code>

Now that we finished the SIMPLE using the small-steps semantics, we can see that this semantic don't handle some errors, like if we use an Add with a number and a boolean, will appear a error from the language we are using, in our case, Ruby.

There is other type of Operational Semantics, it is called Big-Step semantics, and it consists in getting an expression and go straight to its result, instead of making reduction by reduction.

Some of the expression using Big-Steps semantics will immediately be evualated to themselves, others will perfome some computatuion and evaluate to a different expression.

Let's start implementing Number and Boolean.

<code>
class Number < Struct.new(:value)
    def to_s
        value.to_s
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        self
    end
end
<br>
class Boolean < Struct.new(:value)
    def to_s
        value.to_s
    end
    <br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        self
    end
end
</code>

As we can see, those are the expressions that evaluate to themselves.Let's implement Variables, you can notice that it will not change at all:

<code>
class Variable < Struct.new(:name)
    def to_s
        name.to_s
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        environment[name]
    end
end
</code>

We can notice with the implemention of Add, Multiply and LessThan - that will follow - that Big-steps semantics uses a lot of the programming language we are using, in our case, Ruby.

<code>
    class Add < Struct.new(:left, :right)
    def to_s
        "#{left} + #{right}"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        Number.new(left.evaluate(environment).value + right.evaluate(environment).value)
    end
end
<br>
class Multiply < Struct.new(:left, :right)
    def to_s
        "#{left} * #{right}"
    end
    <br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        Number.new(left.evaluate(environment).value * right.evaluate(environment).value)
    end
end
<br>
class LessThan < Struct.new(:left, :right)
    def to_s
        "#{left} < #{right}"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        Boolean.new(left.evaluate(environment).value < right.evaluate(environment).value)
    end
end
</code>

The strong point of this semantics is when it comes to specify the behavior of statements. We only need to concern with the environment, we don't need to worry about the statement in the middle of the evaluation, like we would on small-steps, so, it is simple to implement an assignment in big-steps:

<code>
class Assign < Struct.new(:name, :expression)
    def to_s
        "#{name} = #{expression}"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        environment.merge({ name => expression.evaluate(environment)})
    end
end
</code>

Just merging and returning the environment. After all, DoNothing didn't change a lot, the only thing is that it will return the environment unchanged.

<code>
class DoNothing
    def to_s
        'do-nothing'
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def ==(other_statment)
        other_statment.instance_of?(DoNothing)
    end
<br>
    def evaluate(environment)
        environment
    end
end
</code>

If has a simple job in Big-steps too, just evaluate the condition and return the environment changed by the consequence or alternative, depends if condition is true or false.

<code>
class If < Struct.new(:condition, :consequence, :alternative)
    def to_s
        "if (#{condition}) { #{consequence} } else { #{alternative} }"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate (environment)
        case condition.evaluate(environment)
        when Boolean.new(true)
            consequence.evaluate(environment)
        when Boolean.new(false)
            alternative.evaluate(environment)
        end
    end
end
</code>

Since the idea of a sequence is to evaluate the first statement, then, evulate the second with the environment changed by the first statement, it is easy with evaluate method returning the changed environment.

<code>
class Sequence < Struct.new(:first, :second)
   def to_s
        "#{first}; #{second}"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate(environment)
        second.evaluate(first.evaluate(environment))
    end
end
</code>

Using Big-steps, the idea of while is something like this: first, evaluate the condition, if it is true, evaluate self(the while statement), passing by parameters the environment changed by the evaluation of body. If it is false, just return the environmente unchanged.

<code>
class While < Struct.new(:condition, :body)
    def to_s
        "while (#{condition}) { #{body} }"
    end
<br>
    def inspect
        "#{self}"
    end
<br>
    def evaluate (environment)
        case condition.evaluate(environment)
        when Boolean.new(true)
            evaluate(body.evaluate(environment))
        when Boolean.new(false)
            environment
        end
    end
end
</code>

Let's test the new implementation of SIMPLE:

<code>
statement = 
    While.new(
        LessThan.new(Variable.new(:x), Number.new(5)),
        Assign.new(:x, Multiply.new(Variable.new(:x), Number.new(3)))
    )
=> while (x < 5) { x = x * 3 }
statement.evaluate({ x: Number.new(1) })
=> {:x => 9}
</code>

So, I think you didn't espace the attention that writing SIMPLE in both ways, we have implemented two different Ruby interpreters.

{% for author in site.data.author%}
So, we finished the first part of this post, on the next part, we are going to talk about other semantic, called denotational semantics. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}