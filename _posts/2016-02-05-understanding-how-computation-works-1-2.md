---
layout: posts
title: "Understanding how computation works part 1-2"
summary: "On this post, I will try to make you understand more about computer science. So, in this part, I will talk about Denotational Semantics, and we are going to parse the semantics implementation."
homeImage: "/assets/img/understanding-how-computation-works-1-2.png"
type: post
permalink: understanding-how-computation-works-1-2
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

On the first part of this post, we used an operational perspective, on this second part, let's use othe perspective, the denotational one. Different from the operational semantics that are concerned in showing you what happens with the program execution, the denotational semantics are concerned in translating your program from their native language to other representation. Denotational semantics are more abstract, because instead of turning the program into a real behavior, it is just replacing one language with another. Let's implement SIMPLE with denotational semantics.

On this semantic, we are going to use Ruby's procs, that takes the environment as a argument and return some Ruby object. Let's use this idea:

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
    def to_ruby
        "-> e { #{value.inspect}}"
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
    def to_ruby
        "-> e { #{value.inspect}}"
    end
end
</code>

The method to_ruby returns a string that contains a Ruby code, that builds a proc, we will need to use eval method from Kernel object, to turn them from strings to real code.

<code>
    >>proc = eval(Number.new(5).to_ruby)
    >>proc.call({})
    =>5
</code>

Knowing that we are going to use hash as our environment, let's implement Variables object.

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
    def to_ruby
        "-> e { e[#{name.inspect}]}"
    end
end
</code>

Remember a important thing in denotational semantics, that it is composition, the denotation of the program is constructed from the denotations of its parts. We will see it on Add, Multiply and LessThan.

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
    def to_ruby
        "-> e { (#{left.to_ruby}).call(e) + (#{right.to_ruby}).call(e) }"
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
    def to_ruby
        "-> e { (#{left.to_ruby}).call(e) * (#{right.to_ruby}).call(e) }"
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
    def to_ruby
        "-> e { (#{left.to_ruby}).call(e) < (#{right.to_ruby}).call(e) }"
    end
end
</code>

Now, the statements, for Assign, let's just use it to update the environment, using merge as previously:

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
    def to_ruby
        "-> e { e.merge({ #{name.inspect} => (#{expression.to_ruby}).call(e)}) }"
    end
end
</code>

DoNothing returns the environment unchanged as usual:

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
    def to_ruby
        "-> e {e}"
    end
end
</code>

For If, we can just translate the SIMPLE's if/else into a Ruby if/then/else, and be sure that the environment will be where it is necessary.

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
    def to_ruby
        "-> e { if (#{condition.to_ruby}).call(e)" +
        "then (#{consequence.to_ruby}).call(e)" +
        "else (#{alternative.to_ruby}).call(e)" +
        "end }"
    end
end
</code>

Using the same idea of the previous Sequence object, evaluate the first, produce a new environment, then, use this new environment to evaluate the second.

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
    def to_ruby
        "-> e { (#{second.to_ruby}).call((#{first.to_ruby}).call(e)) }"
    end
end
</code>

And last, the While statement, it is basically execute the body repeatedly before returning the final environment:

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
    def to_ruby
        "-> e {" +
        "while (#{condition.to_ruby}).call(e); e = (#{body.to_ruby}).call(e); end;" +
        " e" +
        " }"
    end
end
</code>

Let's test this new semantics:

<code>
environment = {x: 3}
=> {:x=>3}
proc = eval(While.new(
       LessThan.new(Variable.new(:x), Number.new(5)),
       Assign.new(:x, Multiply.new(Variable.new(:x), Number.new(3)))
     ).to_ruby
)
=> #<Proc:0x00000001530ab0@(eval):1 (lambda)>
proc.call(environment)
=> {:x=>9}
</code>

So, we can see that there is a advantage on denotational semantics, it is the fact that you can ignore the execution flow and focus on how to convert the program into a different representation.

Now, let's try to implement a parser for SIMPLE, we are going to use a Ruby tool called Treetop, a domain-specific language for describing syntax in a way that allows a parser to be automatically generated.

Let's see how Treetop works:

<code>
grammar Simple
    rule statement
        while/assign
    end
<br>
    rule while
        'while (' condition:expression ') { ' body:statement ' }' {
            def to_ast
                While.new(condition.to_ast, body.to_ast)
            end
        }
    end
<br>
    rule assign
        name:[a-z]+ ' = ' expression {
            def to_ast
                Assign.new(name.text_value.to_sym, expression.to_ast)
            end
        }
    end
<br>
    rule expression
        less_than
    end
<br>
    rule less_than
        left:multiply ' < ' right:less_than {
            def to_ast
                LessThan.new(left.to_ast, right.to_ast)
            end
        }
        /
        multiply
    end
<br>
    rule multiply
        left:term ' * ' right:multiply {
            def to_ast
                Multiply.new(left.to_ast, right.to_ast)
            end
        }
        /
        term
    end
<br>
    rule term
        number/variable
    end
<br>
    rule number
        [0-9]+ {
            def to_ast
                Number.new(text_value.to_i)
            end
        }
    end
<br>
    rule variable
        [a-z]+ {
            def to_ast
                Variable.new(text_value.to_sym)
            end
        }
    end
end
</code>

Let's see how to use it, and if it is really working, first we need to requite Treetop, then, load it, after, we need to create a instance of the SimpleParser object, passing a string as argument, this string contains the code that we want to parse, at last, we just use the method to_ast to use the parsed code, that became a abstract tree syntax code.

<code>
require 'treetop'
=> true
Treetop.load('simple')
=>SimpleParser
parse_tree = SimpleParser.new.parse('while (x < 5) { x = x * 3 }')
=> (big return, to summarize, it is a SyntaxNode structure that is a concrete syntax tree, design for manipulation by Treetop parser.)
statement = parse_tree.to_ast
=>while (x < 5) { x = x * 3 }
statement.evaluate({x: Number.new(1) })
=> {:x=>9}
statement.to_ruby
=> "-> e {while (-> e { (-> e { e[:x]}).call(e) < (-> e { 5}).call(e) }).call(e);
 e = (-> e { e.merge({ :x => (-> e { (-> e { e[:x]}).call(e) * (-> e { 3}).call(e) }).call(e)})
 }).call(e);
 end; e }"
</code>

You can see that we can use the two semantics, operational and denotational.

{% for author in site.data.author%}
If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
