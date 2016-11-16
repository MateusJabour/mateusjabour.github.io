---
layout: posts
title: "Understanding how computation works part 6-2"
summary: "On this post, I will try to make you understand more about computer science. In this part of the post we are going to see two more universal system: Tag System, Cyclic Tag System."
homeImage: "/assets/img/understanding-how-computation-works-6-2.jpg"
type: post
permalink: understanding-how-computation-works-6-2
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Computation Logo]({{ page.homeImage }})

{{ page.summary }}

#### Tag system

Tag system works like a Turing machine, but, instead of moving to the sides, Tag system oparates on a string by repeatedly adding new characters to the end of the string and removing some characters from the beginning, it oparates just on the edges of the string.

We can split the Tag System description in two parts, first is the collections of rules, each rule specifies which characters to append to the string when a particular character appears at the beginning of the string. Let's see an example of tag system:

- When the string begins with a, append the character bc.
- When the string begins with b, append the character caad.
- When the string begins with c, append the character ccd.
- After applying any rule, delete three character from the beginning of the string(deletion number is 3).

Performing a tag system is simply following the rules one after other. Have a look at the execution of this tag system:

<code>
aaaaa <br>
aaa<strong>bc</strong><br>
bc<strong>bc</strong><br>
c<strong>caad</strong><br>
ad<strong>ccd</strong><br>
cd<strong>bc</strong><br>
c<strong>ccd</strong><br>
d<strong>ccd</strong>
</code>

Tag Systems only operate directly on string, but we can fet them to perform operations on other kinds of values, like numbers, just by encoding numbers. Let's try to do it using a encoding system that works like this: represent the number n as the string aa followed by n repetitions of the string bb.

Now that we have a encoding scheme, we can manipulate those numbers and make operations with them. One operation is to double the input, like this:

- When the string begins with a, append the character aa.
- When the string begins with b, append the character bbbb.
- After applying any rule, delete two character from the beginning of the string(deletion number is 2).

Watch how this tag system works with the string aabbbb(number 2):

<code>
  aabbbb
  bbbbaa
  bbaabbbb
  aabbbbbbbb(number 4)
  bbbbbbbbaa
  bbbbbbaabbbb
  bbbbaabbbbbbbb
  bbaabbbbbbbbbbbb
  aabbbbbbbbbbbbbbbb(number 8)
</code>

We can see that the doubling is happening, but, it's a infinite loop, what isn't really what we had in mind. We could append new characters instead of appending a character that has a rule to proceed. So, when the string starts with a, let's put cc, and when the string starts with b, let's put dddd, let's do this:

<code>
  aabbbb
  bbbbcc
  bbccdddd
  ccdddddddd
</code>

Now, when we reach the doubled value, the tag system stops, like we wanted. We can simulate a tag system in Ruby, for this, we need to implement an object for the rules, one for the collection of rules and the tag system:

<code>
class TagRule < Struct.new(:first_character, :append_characters)
  def applies_to?(string)
    string.chars.first == first_character
  end
<br>
  def follow(string)
    string + append_characters
  end
end
<br>
class TagRulebook < Struct.new(:deletion_number, :rules)
  def next_string(string)
    rule_for(string).follow(string).slice(deletion_number..-1)
  end
<br>
  def rule_for(string)
    rules.detect { |r| r.applies_to?(string)}
  end
end
<br>
class TagSystem < Struct.new(:current_string, :rulebook)
  def step
    self.current_string = rulebook.next_string(current_string)
  end
end
</code>

With those objects, we can simulate a tag system, let's try to simulate the tag system that doubles the input:

<code>
rulebook = TagRulebook.new(2,
 [
   TagRule.new('a', 'aa'),
   TagRule.new('b', 'bbbb')
 ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbbbb', rulebook)
=> #<struct TagSystem ...>
4.times do
  puts system.current_string
  system.step
end; puts system.current_string
aabbbbbb
bbbbbbaa
bbbbaabbbb
bbaabbbbbbbb
aabbbbbbbbbbbb
=> nil
</code>

We made just 4 steps in here because it would loop forever if we had done one while or until. We can avoid those infinite loops, just by adding some code on those objects:

<code>
class TagRulebook
  def applies_to?(string)
    !rule_for(string).nil? && string.length >= deletion_number
  end
end
<br>
class TagSystem
  def run
    while rulebook.applies_to?(current_string)
      puts current_string
      step
    end

    puts current_string
  end
end
</code>

Now, we can just call #run and let it stop naturally:

<code>
rulebook = TagRulebook.new( 2,
  [
    TagRule.new('a', 'cc'),
    TagRule.new('b', 'dddd')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbbbb
bbbbbbcc
bbbbccdddd
bbccdddddddd
ccdddddddddddd
=> nil
</code>

With this implementation, we can explore more about tags using this encoding scheme. Let's desing a tag system that halves a number:

<code>
rulebook = TagRulebook.new( 2,
  [
    TagRule.new('a', 'cc'),
    TagRule.new('b', 'd')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbbbb
bbbbbbcc
bbbbccd
bbccdd
ccddd
=> nil
</code>

We can even design one that increments number:

<code>
rulebook = TagRulebook.new( 2,
  [
    TagRule.new('a', 'ccdd'),
    TagRule.new('b', 'dd')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbb
bbbbccdd
bbccdddd
ccdddddd
=> nil
</code>

We can also design one tag system that combines those two, just by making the output of the first task matching the encoding of the second. We will see it by designing a system that combines incrementing with doubling, have a look:

<code>
rulebook = TagRulebook.new(2,
  [
    TagRule.new('a', 'cc'), TagRule.new('b', 'dddd'),
    TagRule.new('c', 'eeff'), TagRule.new('d', 'ff')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbb (number 2)
bbbbcc
bbccdddd
ccdddddddd (number 4)
ddddddddeeff
ddddddeeffff
ddddeeffffff
ddeeffffffff
eeffffffffff (number 5)
=> nil
</code>

You can see that the first system just turns the number 2 to the number 4 enconded with the characters c and d, and then, the second system takes this doubled number and increment it, turning it to 5 enconded with the characters e and f.

We can use tag system to check mathematical properties from numbers, we can design a system that says if the number is an even or an odd:

<code>
rulebook = TagRulebook.new(2,
  [
    TagRule.new('a', 'cc'), TagRule.new('b', 'd'),
    TagRule.new('c', 'eo'), TagRule.new('d', ''),
    TagRule.new('e', 'e')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbbbbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbbbbbb
bbbbbbbbcc
bbbbbbccd
bbbbccdd
bbccddd
ccdddd
ddddeo
ddeo
eo
e
=> nil
</code>

Now you wondering, how it works? Easy:

- First the number is halved, using the encoding c/d.
- The rule 'c' takes off 'cc' and adds the characters 'eo', this will give us the result.
- The rule 'd' takes off all 'dd' pairs, leaving only 'eo' if it's an even and leaving 'deo' if it's an odd.
- In the even's case: the 'e' rule will take off 'eo' and will add an 'e'. In the odd's case: the 'd' rule will take off the 'de' and will let the 'o' there.

This is how this system works, let's see an example of an odd:

<code>
system = TagSystem.new('aabbbbbbbbbb', rulebook)
=> #<struct TagSystem ...>
system.run
aabbbbbbbbbb
bbbbbbbbbbcc
bbbbbbbbccd
bbbbbbccdd
bbbbccddd
bbccdddd
ccddddd
dddddeo
dddeo
deo
o
=> nil
</code>

We can use those techniques to simulate a Turing machine. As we saw, tah system is very simple, so, there're a lot of details involved to make this simulation, let's list the steps:

- We'll use a Turing machine that uses only 0's and 1's, with 0 acting as the blank.
- Let's split the tape into two pieces: left part(all the left characters and the head), and the right part(all right characters).
- Treat the left part as a binary number, for example, if we have a tape: 0001101(0)0011000, the left part is 11010, which is 26.
- Treat the right part as a binary number written backward, on the last example, our right part is 1100, 12 on decimal.
- Now, we need to encode those numbers, we can use 'aa' with 26 copies of 'bb' and 'cc' with 12 copies of 'dd'.
- In our example, one way of moving the head to the right is by doubling the left part and halving the right part: 26 becomes 52, that in binary is 110100, and 12 becomes 6, 110 in binary, so, our new tape is 011010(0)011000. To read from the tape, we could just check if the number on the left is an even or odd, and writing 1 or 0 to the tape means incrementing or decremeting that number.
- We can represent the current state with the encode characters used on the left and right tape numbers, for example, we can use a, b, c and d on state 1, on state 2 we can use e, f, g and h, and so on.
- Each rule for the machine is a tag system that rewrites the current string in the appropriate way.
- Combine all those rules to make a large system to simulate the whole machine.

Tag system being capable of simulate a Turing machine give the universal aspect to it.

#### Cyclic Tag System

The cyclic tag system is simpler, but, this is because some extra constraints are used to implement it:

- A cyclic tag system's string can contain only 1's and 0's.
- The rule can only apply when the current string begins with 1.
- It's deletion number is always 1.

Those constraints are very severe, but, to compensate it, there's an aspect on this system, the cyclic aspect. The cyclic aspect consists on the following execution: the first rule is the current rule when the execution begins, but, after each step, the next rule becomes the current rule, this way, the first rule will be called again when the rulebook's end is reached. Let's see an example with three rules: the character 1, 0010 and 10, respectively, are appended. Let's start with the string 11:

<code>
11
1<strong>1</strong>
1<strong>0010</strong>
0010<strong>10</strong>
001010
01010
1010
010<strong>10</strong>
1010
010<strong>0010</strong>
100010
</code>

So, you can see that is very simple, but, we never know what will happens next, isn't obvious. The question is, it will get longer and longer, or it will settle into a repeating pattern of contradictions? We would need to keep running the system to find out.

Let's implement it from the normal tag system, so we don't have a lot of extra work. Let's start by the rules, we just need to hardcode the first character using 1:

<code>
class CyclicTagRule < TagRule
  FIRST_CHARACTER = '1'
<br>
  def initialize(append_characters)
    super(FIRST_CHARACTER, append_characters)
  end
<br>
  def inspect
    "#<CyclicTagRule #{append_characters.inspect}>"
  end
end
</code>

However, the rulebook is different, we'll implement it providing a new #applies_to? and #next_string:

<code>
class CyclicTagRulebook < Struct.new(:rules)
  DELETION_NUMBER = 1

  def initialize(rules)
    super(rules.cycle)
  end
<br>
  def applies_to?(string)
    string.length >= DELETION_NUMBER
  end

  def next_string(string)
    follow_next_rules(string).slice(DELETION_NUMBER..-1)
  end
<br>
  def follow_next_rules(string)
    rule = rules.next
<br>
    if rule.applies_to?(string)
      rule.follow(string)
    else
      string
    end
  end
end
</code>

Different from the normal rulebook, this one always applies to any nonempty string, even if the current rule doesn't.

Now we can create a rulebook full of rules from the cyclic tag system, using the normal tag system object:

<code>
rulebook = CyclicTagRulebook.new([
  CyclicTagRule.new('1'), CyclicTagRule.new('0010'),
  CyclicTagRule.new('10')
])
=> #<struct CyclicTagRulebook ...>
system = TagSystem.new('11', rulebook)
=> #<struct TagSystem ...>
16.times do
  puts system.current_string
  system.step
end; puts system.current_string
11
11
10010
001010
01010
1010
01010
1010
0100010
100010
000101
00101
0101
101
010010
10010
00101
=> nil
</code>

We can notice the same behavior we saw on the execution by hand, now, let's go further on it:

<code>
20.times do
  puts system.current_string
  system.step
end; puts system.current_string
00101
0101
101
011
11
110
101
010010
10010
00101
0101
101
011
11
110
101
010010
10010
00101
0101
101
=> nil
</code>

So, it turns out that this sytem sttle down into a repetitive behavior. Cyclic tag systems are very limited, but, it's possible to use them to simulate any tag system. We can do it following those steps:

- Determine a alphabet(set of characters used).
- Design an encoding scheme that associates each character with a unique string suitable for use in a cyclic tag system.
- Convert each of the original system's rule into a cyclic tag system rule by encoding the characters it appends.
- Fill the cyclic tag system's rulebook with empty rules to simulate deletion.
- Encode the orignal tag system's input string and use it as input to the cyclic tag system.

Let's start by adding the alphabet on the tag system implemetation:

<code>
class TagRule
  def alphabet
    ([first_character] + append_characters.chars.entries).uniq
  end
end
<br>
class TagRulebook
  def alphabet
    rules.flat_map(&:alphabet).uniq
  end
end
<br>
class TagSystem
  def alphabet
    (rulebook.alphabet + current_string.chars.entries).uniq.sort
  end
end
</code>

Let's test it:

<code>
rulebook = TagRulebook.new(2,
  [
    TagRule.new('a', 'ccdd'),
    TagRule.new('b', 'dd')
  ]
)
=> #<struct TagRulebook ...>
system = TagSystem.new('aabbbbbb', rulebook)
=> #<struct TagSystem ...>
system.alphabet
=> ["a", "b", "c", "d"]
</code>

Now, we need to figure out how to encode each character as a string that the cyclic tag system can use. We can use the scheme that each  character is represented as a string of 0s with the same length as the alphabet, with a single 1 character in a position that reflects that character's position in the alphabet. So, for example, 1 would be position 0, we could encode it with 1000, and so on.

To implement this encoding scheme, we'll need to create a object called CyclicTagEncoder that gets constructed with a specific alphabet and then asked to encode strings of characters from that alphabet:

<code>
class CyclicTagEncoder < Struct.new(:alphabet)
  def encode_string(string)
    string.chars.map { |character| encode_character(character) }.join
  end
<br>
  def encode_character(character)
    character_position = alphabet.index(character)
    (0...alphabet.length).map { |n| n == character_position ? "1" : "0" }.join
  end
end
<br>
class TagSystem
  def encoder
    CyclicTagEncoder.new(alphabet)
  end
end
</code>

Now we can encode any string mapde up of a,b, c and d:

<code>
encoder = system.encoder
=> #<struct CyclicTagEncoder alphabet=["a", "b", "c", "d"]>
encoder.encode_character('c')
=> "0010"
encoder.encode_string('cab')
=> "001010000100"
</code>

The encoder give us a way to convert each tag system rule into a cyclic tag system rule. We just need to encode the append_characters of a TagRule ans use the resulting string to build a CyclicTagRule:

<code>
class TagRule
  def to_cyclic(encoder)
    CyclicTagRule.new(encoder.encode_string(append_characters))
  end
end
</code>

Let's see it working on one rule:

<code>
rule = system.rulebook.rules.first
=> #<struct TagRule first_character="a", append_characters="ccdd">
rule.to_cyclic(encoder)
=> #<CyclicTagRule "0010001000010001">
</code>

Now that we converted the append_characters, we lost the first_character information, that triggers the rule, reminding that in cyclic tag system, just the character 1 triggers the rule.

For the conversion, that information will be communicated by the order of the rule in the cyclic tag system: the first rule is for the first character and so on. Any character without a correspoding rule will get a blank rule. Let's implement a #cyclic_rules for the normal rulebook.

<code>
class TagRulebook
  def cyclic_rules(encoder)
    encoder.alphabet.map { |character| cyclic_rule_for(character, encoder) }
  end
<br>
  def cyclic_rule_for(character, encoder)
    rule = rule_for(character)
<br>
    if rule.nil?
      CyclicTagRule.new('')
    else
      rule.to_cyclic(encoder)
    end
  end
end
</code>

And this is what #cyclic_rules produces:

<code>
system.rulebook.cyclic_rules(encoder)
=> [
  #<CyclicTagRule "0010001000010001">,
  #<CyclicTagRule "00010001">,
  #<CyclicTagRule "">,
  #<CyclicTagRule "">
]
</code>

We converted the rules for a and b, that appears first, and the other two blank rules for c and d.

Now, we need to simulate the deletion part, and that's easy, just inserting extra empty rules into cyclic tag system's rulebook so that the right number of characters get deleted after a single encoded character has been successfully processed. Let's implement it:

<code>
class TagRulebook
  def cyclic_padding_rules(encoder)
    Array.new(encoder.alphabet.length, CyclicTagRule.new('')) * (deletion_number - 1)
  end
end
</code>

Our tag system has 4 characters and deletion number of 2, so we need to add four empty rules to delete one simulated character in addition to the one that already gets deleted by the converted rules:

<code>
class TagRulebook
  def to_cyclic(encoder)
    CyclicTagRulebook.new(cyclic_rules(encoder) + cyclic_padding_rules(encoder))
  end
end
<br>
class TagSystem
  def to_cyclic
    TagSystem.new(encoder.encode_string(current_string), rulebook.to_cyclic(encoder))
  end
end
</code>

Let's see what happens qhen we convert our number-incremeting tag system and run it:

<code>
conversionExample.rb(main):034:0* cyclic_system = system.to_cyclic
=> #<struct TagSystem current_string="10001000010001000100010001000100", rulebook=#<struct CyclicTagRulebook rules=#<Enumerator: [#<CyclicTagRule "0010001000010001">, #<CyclicTagRule "00010001">, #<CyclicTagRule "">, #<CyclicTagRule "">, #<CyclicTagRule "">, #<CyclicTagRule "">, #<CyclicTagRule "">, #<CyclicTagRule "">]:cycle>>>
conversionExample.rb(main):035:0> cyclic_system.run
10001000010001000100010001000100
00010000100010001000100010001000010001000010001
0010000100010001000100010001000010001000010001
010000100010001000100010001000010001000010001
10000100010001000100010001000010001000010001
0000100010001000100010001000010001000010001
000100010001000100010001000010001000010001
00100010001000100010001000010001000010001
0100010001000100010001000010001000010001
100010001000100010001000010001000010001
0001000100010001000100001000100001000100010001
001000100010001000100001000100001000100010001
01000100010001000100001000100001000100010001
1000100010001000100001000100001000100010001
000100010001000100001000100001000100010001
00100010001000100001000100001000100010001
0100010001000100001000100001000100010001
100010001000100001000100001000100010001
0001000100010000100010000100010001000100010001
001000100010000100010000100010001000100010001
01000100010000100010000100010001000100010001
1000100010000100010000100010001000100010001
000100010000100010000100010001000100010001
00100010000100010000100010001000100010001
0100010000100010000100010001000100010001
100010000100010000100010001000100010001
0001000010001000010001000100010001000100010001
001000010001000010001000100010001000100010001
01000010001000010001000100010001000100010001
1000010001000010001000100010001000100010001
000010001000010001000100010001000100010001
00010001000010001000100010001000100010001
0010001000010001000100010001000100010001
010001000010001000100010001000100010001
10001000010001000100010001000100010001
0001000010001000100010001000100010001
001000010001000100010001000100010001
01000010001000100010001000100010001
1000010001000100010001000100010001
000010001000100010001000100010001
00010001000100010001000100010001
0010001000100010001000100010001
010001000100010001000100010001
10001000100010001000100010001
0001000100010001000100010001
001000100010001000100010001
01000100010001000100010001
1000100010001000100010001
000100010001000100010001
00100010001000100010001
0100010001000100010001
100010001000100010001
00010001000100010001
0010001000100010001
010001000100010001
10001000100010001
0001000100010001
001000100010001
01000100010001
1000100010001
000100010001
00100010001
0100010001
100010001
00010001
0010001
010001
10001
0001
001
01
1
=> nil
</code>

We can see that:

- The encoded version of the tag system's a rule kicks in here.
- The first full character of the simulated string has been processed, so the following four steps use blank rules to delete the next simulated character.
- After eight steps of the cyclic tag system, one full step of the simulated tag system is completed.


{% for author in site.data.author%}
In the next post, we're going to see more universal systems. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
