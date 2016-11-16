---
layout: posts
title: "Understanding how computation works part 7"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going to see a impossible program."
homeImage: "/assets/img/understanding-how-computation-works-7.jpg"
type: post
permalink: understanding-how-computation-works-7
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

So, let's remember a little bit what we've seen until here. We've seen the finite automatas that couldn't solve problems that involved unrestricted couting, like implemeting an automata that generates a string of brackets exactly closed. We've seen pushdown automatas too, it problem was that we couldn't reuse information in more than one place, making impossible to us to implement a pushdown automata that generates a string with the same number of a's, b's and c's.

After those 2, we've learned a advanced device, called Turing machine, seems to have everything that we need: unlimited storage accessible in any order, arbitrary loops, conditionals and subrotines. We've learned a minimal way of programming, called lambda calculus, that surprised us with its power. And on the last post, we've seen a lot of simple systems like lambda calculus, but with the same universal power of a Turing machine. After all those machines and ways of programming, one question still knocking on our heads: Is there anything that those universal machines can't do? Any impossible programs?

These are pretty deep questions, so, instead of going straight to its answer, let's learn some fundamentals facts from the world of computation.

#### Universal Systems Can Perform Algorithms

First of all, we need to know that the practical purpose of a computing machine is to perform Algorithms. But, what is an algorithm? An algorithm is a list of instructions describing some process to turn an input into an output value, as long as those instructions follows those properties:

- Finitiness: There are finite number of instructions.
- Simplicity: Each instruction is simple enough that it can be performed bt a person with a pencil and paper.
- Termination: It will finish within a finite number of steps for any input.
- Correctness: Following the instructions will produce the right answer for any input.

There's an old algorithm which's called Euclid's algorithm, it was created by Euclid around 300 BC. Basically it takes to numbers and returns the largest integer that divide them both exactly(greatest common divisor). Let's see the step by step of it:

- Name those number x and y.
- Decide which is the larger.
- Subtract the smaller from the larger.
- Repeat the second and third step until x and y are equal.
- When they're equal, their value is the greatest common divisor.

This algorithm follows all properties and can be executed by a Turing machine, by lambda calculus and also by partial recursive function, you can try if you want. For now, I will show you just the implementation of it on Ruby:

<code>
def euclid(x, y)
  until x == y
    if x > y
      x = x - y
    else
      y = y - x
    end
  end
  <br>
  x
end
</code>

Let's check if it's working:

<code>
euclid(18, 12)
=> 6
</code>

Yeah, it's working. As we can see, Euclid is a trivial algorithm, easy to implement. But, can any algorithm be turned into instructions suitable for execution by a machine? There's an idea called "Church-Turing thesis", that believes that any algorithm can be performed by a machine. This idea implies that the Turing machine has enough power to perform any computation that can in principle be carried out by a person following simple instructions.

#### Programs Can Stand In for Turing Machines

For any simulation in this post, we're going to use Ruby, so we don't need to implement a Turing machine, and also we take advantage of all features that Ruby can give us. This doesn't mean that we couldn't simulate our programs in a Turin machine, but we would need to make a Turing machine for each feature from Ruby that we would like to use on the simulation. So, let's stick with Ruby implementation to the rest of the post.

### Code is Data

Programs live a double life. As well as being instructions to control a particular system, we can also think of a program as pure data: a tree of expressions, a raw string of characters, or even a single large number. We've already seen programs-as-data when we've used a tape on a Turing machine to represent a software.

In Ruby, the interpreter is the one that sees the structured represatation of the program, but code-as-data still applies. Consider this simple Ruby program:

<code>
puts 'hello world'
</code>

We programmers can see that this is a program that will print hello world to standard output. But on a lower level, this is just a sequence of characters, and because character are represented as bytes, we can see this sequence as a big number:

<code>
program = "puts 'hello world'"
=> "puts 'hello world'"
bytes_in_binary = program.bytes.map { |byte| byte.to_s(2).rjust(8,'0') }
=> ["01110000", "01110101", "01110100", "01110011","00100000","00100111",
    "01101000", "01100101", "01101100", "01101100", "01101111","00100000",
    "01110111", "01101111", "01110010", "01101100","01100100", "00100111"]
number = bytes_in_binary.join.to_i(2)
=> 9796543849500706521102980495717740021834791
</code>

And, if we get this number, we could convert it back to the program:

<code>
number = 9796543849500706521102980495717740021834791
=> 9796543849500706521102980495717740021834791
bytes_in_binary = number.to_s(2).scan(/.+?(?=.{8}*\z)/)
=> ["1110000", "01110101", "01110100", "01110011","00100000", "00100111",
    "01101000", "01100101", "01101100", "01101100", "01101111", "00100000",
    "01110111", "01101111", "01110010", "01101100", "01100100", "00100111"]
program = bytes_in_binary.map { |string| string.to_i(2).chr }.join
=> "puts 'hello world'"
eval program
hello world
=> nil
</code>

This scheme of encoding a program allows the storage of those programs on disk, or to send over the Internet.

#### Universal Systems Can Loop Forever

We've seen lots of different universal system, and we've seen how powerful universality is, but, those kind of system will inevitably allow us to construct computations that loop forever withou halting. So, maybe someday we're going to have something that doesn't produces infinite loops in it? No, and there're all sorts of specific examples of why this can't be done.

Ruby is universal, so, it's possible to write Ruby that evaluates Ruby, to reach this, we need to implement #evaluate, which takes the source code of a Ruby program and a string to provide that program on standard input, and returns the result of evaluating that profram with that input.

The implementation of #evaluate is very hard to be achieved, so, we're not going to do it here, let's just imagine that we've done the implemetation:

<code>
def evaluate(program, input)
  # parse program
  # evaluate program on input while capturing output
  # return output
end
</code>

Let's assume that #evaluate is bug-free and won't crash while it's evaluating program, just if there's a problem with program. With #evaluate we can implement #evaluate_on_itself, which returns the result of evaluating program with its own source as input:

<code>
def evaluate_on_itself(program)
  evaluate(program, program)
end
</code>

This looks weird, but it's totally legitime, program is a string, so we can treat it both as a program and as a input, code is data.

<code>
evaluate_on_itself('print $stdin.read.reverse')
=> "esrever.daer.nidts$ tnirp"
</code>

Since we have those two implementations, we're able to write a program called does_it_say_no.rb:

<code>
def evaluate(program, input)
  # parse program
  # evaluate program on input while capturing output
  # return output
end
<br>
def evaluate_on_itself(program)
  evaluate(program, program)
end
<br>
program = $stdin.read
<br>
if evaluate_on_itself(program) == 'no'
  print 'yes'
else
  print 'no'
end
</code>

It's simple to understand this program: after defining #evaluate and #evaluate_itself, it reads another Ruby program from standard input and passes it to #evaluate_on_itself to see what that program does when run with itself. If this evaluation results on the 'no', does_it_say_no.rb outputs 'yes', otherwise, it outputs 'no', for example:

<code>
$ echo 'print $stdin.read.reverse' | ruby does_it_say_no.rb
no
</code>

That's the result we expected, clearly, the output of 'evaluate_itself('print $stdin.read.reverse', 'print $stdin.read.reverse')' isn't no. And if we put a program that outputs 'no'?

<code>
$ echo 'if $stdin.read.include?("no") then print "no" end' | ruby does_it_say_no.rb
yes
</code>

And again, just as expected.

But, the big question is, if we run "ruby does_it_say_no.rb < does_it_say_no.rb", what will happen? First, running this can't possibly produce the output yes, since it would need to return the string 'no'. So, imaybe it outputs 'no' instead, but, the structure of the program means that it can only output 'no' if exactly the same computation doesn't output 'no'.

Is it conceivable that it could output some other string, like maybe, or even the empty string? No, it would enter into other contradiction: if #evaluate_itself doesn't return 'no' then the program prints no.

So, if it can't output 'no' or 'yes' or something else, it can't return anything, conclusion, it enters into a infinite loop.

Now you're wondering why I didn't show you a easier and simpler infinite loop, like 'while true do end'. But, by showing a more complex problem, I could show that nonhalting programs are an inevitable consequence of universality, regardless of the specific features of the system. Languages that have been carefully designed to ensure that their programs must always halt are called total programming languages, as opposed to the more conventional partial programming languages whose programs sometimes halt with an answer and sometimes don't.


#### Programs Can Refer to Themselves

The self-referential trick used by does_it_say_no.rb can be used withou causing a infinite loop. We're going to implement something doing it, we're going to implement a program that don't need to take advantage of the operating system or the File class. Let's implement something that could run on JavaScript, that get loaded into memory over a network connection, or C and Java that are compiled and may not have acess to their source at runtime. Fortunately, we can do this, let's take a piece of code like the one that follows:

<code>
x = 1
y = 2
puts x + y
</code>

We want to transform it into a program that looks like this:

<code>
program = '...'
x = 1
y = 2
puts x + y
</code>

Where program is assigned a string containing the source of the complete program. We need to give a value to program, one naive approach is to try to concoct a simple string literal that can be assigned to program, but this wouldn't work, since we need to have this literal inside the program source code. It woueld require program to begin with the string 'program = ' followed by the value of program, it would be a infinite loop:

<code>
program = %q{ program = %q{ program = %q{ program = %q{ program = %q{ program = %q{}}}}}}
x = 1
y = 2
puts x + y
</code>

So, to avoid this loop, we could construct this program in three parts:

- A. Assign an string literal to a variable(data).
- B. Use that string to compute the current program's source code and assign it to program.
- C. Do whatever other work the program is supposed to do.

So the structure will look like this:

<code>
data = '...'
program = ...
x = 1
y = 2
puts x + y
</code>

That sound good, but light on specific details. How do we know what string to actually assign to data in part A, and how do we use it in part B to compute program? Here's one solution:

- In part A, we can create a string literal that contains the source code of parts B and C and assign it to data. It doesn't need to "contain itself", because it's not the source of the full program.
- In part B, we can compute a string that contains the source code of part A. We can do this because part A mostly consists of a big string literal whose value is available as data, so we just need to add "data =" before data value.

This solution sounds circular - Part A produces source of part B and part B produces the source of part A - but, it will avoid an infinite regress. We can start to implement more now that we know how it will work:

<code>
data = %q{
program = ...
x = 1
y = 2
puts x + y
}
program = ...
x = 1
y = 2
puts x + y
</code>

We know that part A is just "data = %q{...}" with the value of "data" filling the gap between the curly braces, so we can complete the value of "program" too:

<code>
data = %q{
program = ...
x = 1
y = 2
puts x + y
}
program = "data = %q{#{data}}" + ...
x = 1
y = 2
puts x + y
</code>

Now, only the source code of parts B and C is missing on "program", which is exactly what "data" contains, so we can append this value to finish it off:

<code>
data = %q{
program = ...
x = 1
y = 2
puts x + y
}
program = "data = %q{#{data}}" + data
x = 1
y = 2
puts x + y
</code>

And now, we can fix "program" inside "data":

<code>
data = %q{
program = "data = %q{#{data}}" + data
x = 1
y = 2
puts x + y
}
program = "data = %q{#{data}}" + data
x = 1
y = 2
puts x + y
</code>

And that's it, let's test this thing and see if it's properly working, let's use "puts program" instead of x and y:

<code>
data = %q{
program = "data = %q{#{data}}" + data
puts program
}
=> "\nprogram = \"data = %q{\#{data}}\" + data\nputs program\n"
program = "data = %q{#{data}}" + data
=> "data = %q{\nprogram = \"data = %q{\#{data}}\" + data\nputs program\n}\nprogram = \"data = %q{\#{data}}\" + data\nputs program\n"
puts program
data = %q{
program = "data = %q{#{data}}" + data
puts program
}
program = "data = %q{#{data}}" + data
puts program
=> nil
</code>

So, we can notice that "program" surely prints the whole program. You can see that we don't need fancy and special features to create a program using self-reference.

#### Decidability

We've seen that Turing machines are very powerful and flexible, one example of that is that they can execute program encoded as data, other thing is the capability of perform any algorithm you can imagine, they can run an unlimited amount of time and calculate their own description. That's why it is the representation of universal system in general.

But, is there anything that this machine can't do? Before answering it, let's get more precise. What kind of things can we ask a Turing machine to do, and how can we tell wheter it's done it? Are we looking for problems whose solutions are merely beyond out current understanding, or problems that we already know we'll neve solve?

We can focus on decision problems. A decision problem is any question with a yes or no as answer, like "is 2 less them 3?". A decision problem is decidable(or computable) if there're an algorithm that can solve it in a finite amount of time foy any input. We know that the Church-Turing thesis claims that every algorithm can be performed by a Turing machine, so for a problem to be decidable, it's to be possible to design it on a Turing machine.

Well, not all decision problems are decidable, some are undecidable: there isn't guaranteed-to-halt algorithm for solving them. A problem to be undecidable it needs to be impossible to solve for some inputs.

#### The Halting Problem

The most famous undecidable problem is the halting problem, it's a task that decides wheter the executation of a Turing machine with a particular tape will ever halt. We're going to try to build the Halting Checker, and we're going to discover why the halting problem isn't obviously undecidable. Let's have a look on a program that will definitely halt:

<code>
input = $stdin.read
puts input.upcase
</code>

If we add something, it will never halt:

<code>
input = $stdin.read
<br>
while true
  # do nothing
end
<br>
puts input.upcase
</code>

We could write a halting checker for this situation and distinguish between those two cases, but just for them.

<code>
def halts?(program, input)
  if program.include?('while true')
    false
  else
    true
  end
end
</code>

This implementation of #halts? gives us the right answers for the two example programs:

<code>
always = "input = $stdin.read\nputs input.upcase"
=> "input = $stdin.read\nputs input.upcase"
halts?(always, 'hello world')
=> true
never = "input = $stdin.read\nwhile true\n# do nothing\nend\nputs input.upcase"
=> "input = $stdin.read\nwhile true\n# do nothing\nend\nputs input.upcase"
halts?(never, 'hello world')
=> false
</code>

But #halts? answers can be wrong for other programs, programs that depends on the value of their input:

<code>
input = $stdin.read

if input.include?('goodbye')
  while true
    # do nothing
  end
else
  puts input.upcase
end
</code>

We could extend out halting checker to cope with this specific case:

<code>
def halts?(program, input)
  if program.include?('while true')
    if program.include?('input.include?(\'goodbye\')')
      if input.include?('goodbye')
        false
      else
        true
      end
    else
      false
    end
  else
    true
  end
end
</code>

Now we have a checker that gives the correct answer for all three programs and anu possible input string:

<code>
halts?(always, 'hello world')
=> true
halts?(never, 'hello world')
=> false
sometimes = "input = $stdin.read\n\nif input.include?('goodbye')\n  while true\n    # do nothing\n  end\nelse\n  puts input.upcase\nend"
=>"input = $stdin.read\n\nif input.include?('goodbye')\n  while true\n    # do nothing\n  end\nelse\n  puts input.upcase\nend"
halts?(sometimes, 'hello world')
=> true
halts?(sometimes, 'goodbye world')
=> false
</code>

And you could add more and more cases on your #halts? implementation, but, you would never reach a general solution. It's impossible to implement something that will "see the future", because, the only way that a method like this could work, is by executing it and then, you would say if it halts or not, and if you get into a infinite loop, you're not going to get your answer.
If I show you a program, you will be able to say if it halts or not:

<code>
input = $stdin.read
output = ''
<br>
n = input.length
until n.zero?
  output = output + '*'
  n = n - 1
end
<br>
puts output
</code>

Okay, now the question, why we know that this algorithm will halt? Because we know about Ruby and math, so, it's easy.

#### It'll Never Work

Clearly would be hard to implement #halts? correctly, but doesn't mean that this problem is undecidable, there're many of problems that are difficult but not impossible to solve. So, how can we know that the #halts? implementation exists or not?

So, let's pretend that the halting problem is decidable, so, everytime we call #halts?(program, input), it will return us true or false.

<code>
def halts?(program, input)
  # parse program
  # analyse program
  # return true if program halts on input, false if not
end
</code>

With this, we could build does_it_halt.rb, which is a program that reads another program as input and print yes or no depeding on whether that program halts when it reads the empty string:

<code>
def halts?(program, input)
  # parse program
  # analyse program
  # return true if program halts on input, false if not
end
<br>
def halts_on_empty(program)
  halts?(program, '')
end
<br>
program = $stdin.read
<br>
if halts_on_empty?(program)
  print 'yes'
else
  print 'no'
end
</code>

With this, we could solve the problem of Christian Goldbach in 1742, that says that every even integer greater than 2 can be written as the sum of two primes. With our new program, if it loops forever, it means that it's truem right? We could use this program to test this:

<code>
require 'prime'
<br>
def prime_less_than(n)
  Prime.each(n - 1).entries
end
<br>
def sum_of_two_primes?(n)
  primes = primes_less_than(n)
  primes.any? { |a| primes.any? { |b| a + b == n } }
end
<br>
n = 4
<br>
while sim_of_two_primes?(n)
  n = n + 2
end
<br>
print n
</code>

But, this is too good to be true. We would need more knowledge about number theory beyond our current understanding. To have an idea, mathematicians have been working for hundreds of years to try to prove or disprove this conjecture.

#### Fundamentally impossible

So, we were trying to understand why the halting problem is undecidable, but we didn't get a conclusive proof until now. Here's why #halts? can never work: if it did work, we'd be able to construct a new method #halts_on_itself? that calls #halts to determine what a program does when run with its own source code as input:

<code>
def halts_on_itself?(program)
  halts?(program, program)
end
</code>

It will return us a boolean, true for halting, false for infinite loops. We #halts and #halts_on_itself, we can write a program called do_the_opposite.rb:

<code>
def halts?(program, input)
  # parse program
  # analyse program
  # return true if program halts on input, false if not
end
<br>
def halts_on_itself?(program)
  halts?(program, program)
end
<br>
program = $stdin.read
<br>
if halts_on_itself(program)
  while true
    # do nothing
  end
end
</code>

As you can see, the name of the program already describes itself, it does the exactly opposite, if the program halts, it will enter on a infinite loop. So, what if we do do the "ruby opposite.rb < do_the_opposite.rb"? Let's think about the alternatives we have: if it return true(program halts), so, it will loop forever, which means that #halts_on_itself? was wrong about what would happen, and, if it's the opposite, the program would halt, contradicting again the #halts_on_itself? prediction. So, both ways will be wrong. What we've showed here is that #halts can never return a satisfactory answer when called with do_the_opposite.rb as both program and input arguments, that means there are only two fates for a real implementation of #halts:

- It sometimes fives the wrong answer for this case.
- It sometimes loop forever and never returns any answer.

So a complete implementation of #halts? can never exist.

#### Other Undecidable Problems

Let's see other example of an undecidable problem. Suppose we've been give the job of constructing a Ruby program to print "Hello World". Instead of just doing that, we decide to build a tool that decides wheter or not a particular program prints hello_world when supplied with a particular input. Imagine that we succeed in developing a method called #prints_hello_world? that can make the decision about any program. Let's omit the implementation:

<code>
def prints_hello_world(program, input)
  # parse program
  # analyze program
  # return true if program prints "hello world", false if not
end
</code>

Now, we can use this implementation to implement another method, #halts?. For now, #halts? will do two things: evaluates program with input available on its standard input and then print hello world. Let's see its implementation:

<code>
def halts?(program, input)
  hello_world_program = %Q{
    program = #{program.inspect}
    input = $stdin.read
    evaluate(program, input) # evaluate program ignoring its output
    print 'hello world'
  }

  prints_hello_world?(hello_world_program, input)
end
</code>

This implementation of #halts? shows that the halting problem can be reduced to the problem of checking wheter a program prints hello world. We already know that #halts? can't exist, logically, #prints_hello_world? neither.

#### Coping with Uncomputability

Now that we know that we're never going to have a method like #halts?, we need to have others ways of maintaining our code and be certain that it will work, so, there're some thing that you can do for it:

- Ask undecidable questions, but give up if an answer can't be found.
- Ask several small questions whose answers provide evidence for the answer to a larger question. Even if you're using automated tests or unit tests, because those can't give us the guarantee that this program will work with ALL inputs.
- Ask decidable question by being conservative where necessary.
- Approximate a program by converting it into something simpler, then ask decidable question about the approximation.

{% for author in site.data.author%}
In the next post, we're going to see more about the last hint of testing your code. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
