---
layout: posts
title: "Design patterns: What are those?"
summary: "We're going to start a new series of posts, they'll be about design patterns, on this first post we will learn about the basics of object-oriented computation and we're going to know what are design patterns."
homeImage: "/assets/img/design-patterns-1.jpg"
type: post
permalink: design-patters-what-are-those
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Design patterns are cool]({{ page.homeImage }})

Building object-oriented softwares is a little bit different, we need to think more than just about the objectives of the software, we need to think about a lot of different stuff that only object-oriented programs have, some examples: Encapsulation, granularity, interfaces, inheritance, etc. Now, you seem a little bit confused, "What are those?" you're asking, but, this post was made for you that don't know any of those words.

I wouldn't say that program object-oriented software is easy, I would be lying, and I would be lying if I'd say that reusability in object-oriented programs is a easy thing to achieve. But, the good thing is that, if you build a good reusable program, you can use it for many problems, and basically design patterns are reusable patterns for you to use in your programs. A design pattern consists in four elements: name, problem, solution and consequences. Every pattern will have it four elements different from another pattern. Let's understand better each element:

- Pattern name: The name of the design pattern is a way of facilitate the communication between developers, they can refer a pattern easily by its name.
- Problem: The pattern's problem describes when to apply the pattern, it explains the problem and its context, sometimes, the problem will present a list of conditions that must be met before it makes sense to apply the pattern.
- Solution: the solution describes the elements that make up the design, an abstract description of a design problem and how a general arrangement of elements(objects and classes) solves it.
- Consequences: the consequences are the results and trade-offs of applying the pattern. Often the trade-offs are space and time.

Design patterns are based on practical solutions that have been implemented in mainstream object-oriented programming language like Smalltalk and C++.

### Design patterns in Smalltalk MVC

MVC is Model/View/Controller, is used to build user interfaces in Smalltalk. We can use this example to make you understand better the meaning of "pattern."

MVC consists in three kinds of objects, the model, that is the application object, the view, that's the screen presentation, and the controller, that defines the way the user interface reacts to user input. MVC is more flexible and reusable than the older ways of design user interfaces.

The relationship of the model and the view is very simple, the view must reflex the model's state, if this state changes, the model notifies the view, and the view has the opportunity of updating itself. Having this relationship, we're able to use multiple views to a single model, to provide different presentations.

We can think of this case as a more general problem, decoupling objects so that changes to one can affect any number of others without requiring the changed object to know details of the others. We will see a object that uses this kind of thinking, called Observer.

Another thing about views in MVC is that the views can be nested. For example, a control panel of buttons might be implemented as a complex view containing nested button views. Again, the design is applicable to a more general problem, when you want to group objects and treat them like an individual object. We're going to see this design, that's called Composite.

Other fact about MVC is that, we can interact with the interface(view) without changing its visual presentation. But, you're still able to change the way it responds to a keyboard or even use a pop-up. MVC encapsulate those "new" responses on a Controller object. A view uses an instance of a Controller subclass to implement a particular response strategy. This relationship is an example of the Strategy design pattern.

### Describe Design Patterns

To describe a design pattern, we're going to use several topics, so it's better to know when, how and why we're using this or that design pattern. I will list each topic with it description:

- *Pattern Name and Classification*: The pattern's name conveys its essence. A good name is vital because it will become part of your design vocabulary.
- *Intent*: Just a short sentence explaining what the design does, its rationale and intent, which particular design issue it address.
- *Also known as*: Other well-known names for the pattern, if any.
- *Motivation*: A scenario that will help you to understand how the design will solve the problem.
- *Applicability*: The situations that the design can be applied, examples of poor designs that the pattern can address.
- *Structure*: A graphical representation of the classes in the pattern using a notation based on the Object Modeling Technique and interaction diagrams to illustrate sequences of requests and collaboration between objects.
- *Participants*: the classes and objects participating in the design.
- *Collaborations*: How the participants collaborate to carry out their responsibilities.
- *Consequences*: We're going to see the trade-offs and results of using the design.
- *Implementation*: What pitfalls, hints or techniques should you be aware of when implementing the pattern? Are there language-specific issues?
- *Sample code*: Code fragment that illustrate how you might implement the pattern in C++ or Smalltalk.
- *Known uses*: Real examples in real systems. We're going to have at least two examples per design.
- *Related Patterns*: What design patterns are closely related to this one, the differences and hints of which other design should we use with this one.

### Catalog of Design Patterns

We'll see know a short description of each design pattern that we're going to see in these posts.

- Abstract Factory: Provide an interface for creating families of related or dependent objects without specifying their concrete classes.
- Adapter: Convert the interface of a class into another interface clients expect.
- Bridge: Decouple an abstraction from its implementation.
- Builder: Separate the construction of a complex object from its representation so that the same construction process can create different representations.
- Chain of Responsibility: Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.
- Command: Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue or log request.
- Composite: Compose objects into three structures to represent part-whole hierarchies.
- Decorator: Attach additional responsibilities to an object dynamically.
- Facade: Provide a unified interface to a set of interfaces in a subsystem.
- Factory Method: Define an interface for creating an object, but let subclasses decide which class to instantiate.
- Flyweight: Use sharing to support large numbers of fine-grained objects efficiently.
- Interpreter: Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences in the language.
- Iterator: Provide a way to access the elements of an aggregate objects sequentially without exposing its underlying representation.
- Mediator: Define an object that encapsulates how a set of objects interact.
- Memento: Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
- Observer: Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- Prototype: Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.
- Proxy: Provide a surrogate or placeholder for another object to control access to it.
- Singleton: Ensure a class only has one instance, and provide a global point of access to it.
- State: Allow an object to alter its behavior when its internal state changes.
- Strategy: Define a family of algorithms, encapsulate each one, and make them interchangeable.
- Template Method: Define the skeleton of an algorithm in an operation, deferring some steps to subclasses.
- Visitor: Represent an operation to be performed on the elements of an object structure.

### Organizing the Catalog

Each design pattern has its granularity and level of abstraction. Because of the amount of design patterns, we need to organize them. Classifying them can help us visualize them better.

![tabela de classificacao]()

There're two criteria to classify patterns: Purpose and Scope. The first one reflects what a pattern does, patterns can be creational, structural and behavioral. Creational patterns concern the process of object creation. Structural patterns deal with the composition of classes or objects. Behavioral are patterns that defines the way in which classes or objects interact and distribute responsibility.

The second one, scope, specifies whether the pattern applies primarily to classes or to objects. Classes patterns deal with relationship between classes and their subclasses. Object patterns deal with object relationship.

Creational class patterns defer some part of object creation to subclasses, while Creational object patterns defer it to another object. The Structural class patterns use inheritance to compose classes, while Structural object patterns describe ways to assemble objects. The Behavioral class patterns use inheritance to describe algorithms and flow of control, and the Behavioral object patterns describe how a group of objects cooperate to perform a task.

### How Design Patterns Solve Design Problems

Design Patterns can solve a lot of day-to-day problems, let's see some of the problems that it can solve and how they solve them.

#### Finding the appropriates objects

Object-oriented programming are based on objects, objects package both data and procedures that operate on that data. The procedures are called methods. The requests are sent from a client to a object, requesting a certain procedure. Request are the only way to get an object to execute an operation.

Encapsulation is important in Object-oriented programming, it's what protect the data to be seen by the exterior of the object. Encapsulation consists in get or set the data only through methods, there's no direct access to data from an object.

We have a lot of factors that comes to play when we're programming in object-oriented systems: encapsulation, granularity, dependency, flexibility, etc. Those factors are what make Object-oriented programming so hard.

Object-oriented design methodologies favor many different approaches. You can write a problem statement, single out the nouns and verbs, and create corresponding classes and operations. Or you can focus on the collaborations and responsibilities in your system. Or even model the real world and translate the objects found during analysis into design. There will always be disagreement on which approach is best.

Design patterns help you identify less-obvious abstractions and the objects that can capture them.

### Determining Object Granularity

Object varies in size and number. They can represent everything down to the hardware or all the way up to entire application. Design patterns address the issue of knowing what exactly is an object. The Facade pattern describes how to represent complete subsystems as object, and Flyweight pattern describes how to support huge numbers of object into smaller object. Abstract Factory and Builder yield objects whose only responsibilities are creating other objects.

### Specifying Object Interfaces

The signature of the object consists in the method name and the parameters it takes. A set of signatures  for objects is called interface. The interface characterizes the complete set of requests that can be sent to the object. A type is a name used to denote a particular interface. We speak of an object as having the type "Window" if it accepts all requests for the operations defined in the interface names "Window".

Interfaces can contain other interfaces as subsets, we say that a type is a subtype of another if its interfaces contains the interface of its supertype. Interfaces are fundamental in object-oriented systems.

Maybe we can have 2 objects with the same signature of method and support the same request, but have different implementations for this same request. The run-time association of a request to an object and one of its operations is known as dynamic binding.

Dynamic binding lets you substitute objects that have identical interfaces for each other at run-time. This is called polymorphism, and it's a key concept in object-oriented systems.

Design patterns help you define interfaces by identifying their key elements and the kinds of data that get sent across an interface. Also, design patterns specify relationship between interfaces.

### Specifying Object Implementation

An object's implementation is defined by a class. The class specifies the internal data, representation and methods of the object. On the OMT-based notation, the class is a rectangle with the operations and the data:

![class omt]('')

Objects are created by instantiating a class. The object is a instance of the class. A dashed arrowhead line indicates a class that instantiate objects of another class.

![instanciando objetos]('')

We can use class inheritance to define new classes. When a sub-class inherits from a parent class, it includes the definition of all the data and operations that the parent class defines. We indicate subclasses with a vertical line and a triangle:

![subclass indicacao]('')

An abstract class is one whose main purpose is to define a common interface for its sub-classes, they can't be instantiated. The operations that an abstract class declares but doesn't implement are called abstract operations. Opposite of an abstract class is a concrete class.

Subclasses can override methods of their parent class. This way, a sub-class handle the request differently from it parent class. To indicate a abstract class, the name of it appear in slanted type.

![abstract indicacao]('')

A mixin class is a class that's intended to provide an optional interface or functionality to other classes. It's similar to abstract class in that it's not intended to be instantiated. Mixins classes require multiple inheritance:

![mixin indicacao]('')


### Class versus Interface Inheritance

Let's try to understand the difference between an object's class and its type. The class defines how the object is implemented, internal state and implementation of its operations. The type refers to its interface, the set of requests to which it can respond. An object can have many types, and many objects of different classes can have the same type.

Type and class are very close to each other, if we think about it, a class defines operations that the object can perform and also defines the object's type. When we say that the object is an instance of a class, we imply that the object supports the interface of that class.

A difference that we need to understand is the difference between class and interface inheritance. Class inheritance defines an implementation of an object in terms of another. It shares code and representation. Interface inheritance describes when an object can be used in place of another.

Many of the design patterns use this distinction, for example, the Chain of Responsibility must have a common type, but usually they don't share a common implementation. Composite often defines a common implementation, meanwhile Component defines a common interface.

### Programming to an Interface, not an Implementation

Class inheritance can be defined by reuse of functionality. It allows you to define a new object easily and fast, in terms of a old one. However, this is just half of the story. Inheritance's ability to define families of objects with identical interfaces is also important, since polymorphism depends on it.

When inheritance is used carefully, all classes derived from abstract class will share its interface, this way, a subclass merely adds or override operations, and don't hide operation of the parent class. So, ALL subclasses can respond to the request in the interface of this abstract class, making them all subtypes of the abstract class. There are two benefits on manipulating objects like this:

- Client remain unaware of the specific types of objects they use, as long as the object adhere to the interface that clients expect.
- Clients remain unaware of the classes that implement these objects. Clients only know about the abstract class defining the interface.

Reducing implementation dependencies between subsystems. So, I repeat what's on the title: "Program to an interface, not an implementation".

### Putting Reuse Mechanism to Work.

We understand a lot of basic fundamentals of object-oriented programming, but the challenge is to apply them to build flexible, reusable software. Design patterns will show us how to do it.

#### Inheritance versus Composition

Those two are techniques to reuse functionality. We saw that class inheritance lets you define the implementation of one class in terms of another, we can refer this reuse as "white-box reuse" because of its visibility, the parent classes are visible to subclasses.

Object Composition is an alternative, here, new functionality is obtained by assembling or composing objects to get more complex functionality, it requires that the object being composed have well-defined interfaces. This reuse is called "black-box reuse", because no internal details of objects are visible.

The advantages of both are: Class inheritance is defined statically at compile-time and is straightforward to use, since it's supported directly by the programming language, also, it makes easier to modify the implementation being reused. Object composition are accessed solely through their interfaces, so, it doesn't break encapsulation, also, any object can be replaced at run-time by another as long as it has the same type.

The disadvantages are: For inheritance, first, you can't change the implementations inherited from parent classes at run-time, because inheritance is defined at compile-time. Second, and generally worse, parent classes often define at least part of their subclasses' physical representation. Because inheritance exposes a subclass to details of its parent's implementation, it's often said that "inheritance breaks encapsulation". For composition, it is defined at run-time, dynamically, through objects acquiring references to other objects, it requires objects to respect each others' interfaces, which in turn requires carefully designed interfaces that don't stop you from using one object with many others.

But, Object composition has an effect on system design. Using composition over inheritance helps you keep each classes encapsulated and focused on one task, also, your classes and class hierarchies will remain small. That leads us to a second important sentence on object-oriented design: "Favor object composition over class inheritance".

But, remember that you can achieve reusability without creating new components. You should be able to get everything you need just by assembling existing components through composition. It's rare to do it, because the set of available components is not very rich enough.

#### Delegation

Delegation makes composition as powerful for reuse as inheritance, basically, in delegation we have two objects involved in handling a request, a receiving object delegates operations to its delegate. It's similar to subclasses deferring requests to parent classes. But in inheritance we can refer to the receiving object using this/self. To achieve this with delegation, the receiver passes itself to the delegate to let the delegated operation refer to the receiver.

It's easier to visualize it with an example: Instead of creating a class Window as a subclass of Rectangle, we could reuse the behavior of Rectangle on Window by keeping a Rectangle instance variable and delegating Rectangle-specific behavior to it. We replace the verb "be" with the verd "have", Window has a Rectangle.

Have a look on the diagram:

![Delegation diagram]('')

A plain arrowhead line indicates that a class keeps a reference to an instance of another class. The reference has an optional name, 'rectangle' in this case.

Delegation is good to compose behaviors at run-time and to change the way they're composed. The Window can become a Circle in run-time, for example. The only problem with delegation is that's hard to understand the software because it becomes dynamic and high parameterized. It's important to use it just when simplifies more than complicates. There isn't a specific rule that tell you exactly when to use it, depends of the context, just with experience you will detect when to use it or not.

Several designs use delegation. State, Strategy, and Visitor depend on it. Other patterns use delegation less heavily. Mediator and Chain of Responsibility are one of those.


#### Inheritance versus Parameterized Types

Another reusing technique is parameterized types, also knowns as generics or templates. This technique lets you define a type without specifying all the other types it uses. The unspecified types are supplied as parameters at the point of use. For example, a List class can be parameterized by the type of elements it contains. To declare a List of strings or integers, you just need to supply "String" or "Integer" type as parameter.

Parameterized types give us a third way to compose behavior in object-oriented systems. Many designs uses any of these three techniques. On those posts, there's no design that uses Parameterized types, but, we can use them on occasion to customize a pattern's implementation.

### Relating Run-Time and Compile-Time Structures

Object-oriented program's run-time structure often bears little resemblance to its code structure. The code structure is frozen at compile-time; it consists of classes in fixed inheritance relationship. The run-time structure consists of rapidly changing networks of communicating objects. In fact, two structures are largely independent.

Consider the distinction between object aggregation and acquaintance and how differently they manifest themselves at compile and run-times. Aggregation owns or its responsible for another object, basically is having or being part of another object. An aggregate and its owner have identical lifetimes.

Acquaintance merely knows of another object. Sometimes acquaintance is called 'association' or the 'using' relationship. Acquaintance is a weaker relationship than aggregation and suggests much looser coupling between objects.

In our diagram, a plain arrowhead line denotes acquaintance and an arrowhead line with a diamond at its base denotes aggregation:

![Aggregation diagram]('')

It's easy to confuse those two, because they are often implemented in the same way. Ultimately, acquaintance and aggregation are determined more by intent than by explicit language mechanisms. The distinction may be hard at compile-time structure, but it's significant. Many designs capture the distinction between compile-time and run-time structures explicitly. Composite and Decorator are especially useful for building complex run-time structures.

### Designing for Change

The key to maximizing reuse lies in anticipating new requirements and changes to existing requirements, and in designing your systems so that they can evolve accordingly.

To achieve robustness to those changes, we must consider how the system can change over its lifetime. You'll need to count on the risks of a redesign in the future. Changes can involve class redefinition and reimplementation, client modification, and retesting.

Design patterns help you avoid this by ensuring that a system can change in specific ways. Each design pattern lets some aspect of system structure vary independently of other aspects. Let's see some redesign situations and which design pattern can help it:

1. Creating an object by specifying a class explicitly. This way, it commits you to a particular implementation instead of a particular interface. To avoid this, create objects indirectly. Design patterns that can help on this are: Abstract Factory, Factory Method, Prototype.
2. Dependence on specific operations. This way, you commit to one way of satisfying the request. By avoiding hard-coded requests, you make it easier to change the way a request gets satisfied both at compile or run-time. The design patterns to help you achieve this: Chain of Responsibility and Command.
3. Dependence on hardware and software platform. External operating system interfaces and application programming interfaces (APIs) are different on different hardware and software platform. It's important to design your system to limit its platform dependencies. Design patterns that can help: Abstract Factory and Bridge
4. Dependence on object representation or implementations. Clients that know how an object is represented, stored, located or implemented might need to be change when the object changes. Hiding this information from clients keeps changes from cascading. Recommended design patterns are Abstract Factory, Bridge, Memento and Proxy.
5. Algorithm dependencies. Algorithms are often extended, optimized and replaced during development and reuse. Objects that depend on an algorithm will have to change when the algorithm changes. Isolating algorithm with chance to change is a good solution. Design patterns that helps you do this: Builder, Iterator, Strategy, Template Method and Visitor.
6. Tight coupling. Classes that are tightly coupled are hard to reuse in isolation, since they depend on each other. Tight coupling leads to monolithic systems, where you can't change or remove a class without understanding and changing many other classes. Loose coupling increases the probability that a class can be reused by itself and that a system can be learned, ported, modified and extended more easily. Design patterns that do those things are: Abstract Factory, Bridge, Chain of Responsibility, Command, Facade, Mediator and Observer.
7. Extending functionality by subclassing. Customizing an object by subclassing often isn't easy. Every new class has a fixed implementation overhead(initialization, finalization, etc.). Defining a subclass also requires an in-depth understanding of the parent class. Object composition in general and delegation in particular provide flexible alternatives to inheritance for combining behavior. Many design patterns produce designs in which you can introduce functionality just by defining one subclass and composing its instances with existing ones, the design patterns that do this are: Bridge, Chain of Responsibility, Composite, Decorator, Observer and Strategy.
8. Inability to alter classes conveniently. Sometimes you have to modify a class that can't be modified conveniently. But, you need the source code and don't have it. Or even any change would require modifying lots of existing subclasses. Design patterns that can modify those classes even with those circumstances are: Adapter, Decorator and Visitor.

#### Application Programs

If you're building an application program such as a document editor or spreadsheet, then internal reuse, maintainability, and extension are high priorities. Internal reuse ensures that you don't design and implement any more than you have to. Design patterns that reduce dependencies can increase internal reuse. Design patterns also make an application more maintainable when they're used to limit platform dependencies and to layer a system.

#### Toolkits

Often an application will incorporate classes from one or more libraries of predefined classes called toolkits. A toolkit is a set of related and reusable classes designed to provide useful, general-purpose functionality. Toolkit design is arguably harder than application design, because toolkit gave to work in many applications, need to be more general. It's important to avoid assumptions of the use of the toolkit you're implementing, so, you can make it the more flexible as possible.

#### Frameworks

A framework is a set of cooperating classes that make up a reusable design for a specific class of software. The framework dictates the architecture of you application. It will define the overall structure, its partitioning into classes and objects, the key responsibilities thereof, how the classes and objects collaborate and the thread of control. With all this predefined, it's easier to concentrate on the specifics of you application.

Reuse on this level leads to an inversion of control between the application and the software on which it's based. When you use a toolkit, you write the main body of the application and call the code you want to reuse. When you use a framework, you reuse the main body and write the code it calls. You'll write the operations with particular names and calling conventions, but, without a lot of design decisions.

Framework are the hardest of all to design. When you're designing it, you gamble that one architecture will work for all applications in the domain, and you need to do it as flexible and extensible as possible.

Because patterns and frameworks are similar, people often wonder how or even if they differ. Let's see some differences:

1. Design patterns are more abstract than frameworks.
2. Design patterns are smaller architectural elements than frameworks.
3. Design patterns are less specialized than frameworks.

Frameworks are becoming increasingly common and important. They are the way that object-oriented systems achieve the most reuse.

### How to Select a Design Pattern

With so many patterns, it's hard to choose one that address a particular design problem, especially if the catalog is new and unfamiliar to you. Let's see some different approaches to finding the design pattern that's right for you problem:

- Consider how design patterns solve design problems: we have already seen how to choose the appropriate pattern, determine object granularity, specify object and several other ways in which patterns solve design problems.
- Scan Intent topic: We have listed the intent of each design pattern, it's a good thing to read through each one to find the best pattern for the situation.
- Study how patterns interrelate: On the figure below, you can see the relationships between each pattern, studying it will help you to understand better and choose better.

![relations]('')


- Examine a cause of redesign: Look at the causes of redesign, problems that involves one or more of them. Then look at the patterns that help you avoid the causes.
- Consider what should be variable in your design. This approach is the opposite of the focusing on the causes of redesign. Instead of considering what might force a change to a design, consider what you want to be able to change without redesign.

### How to use a Design Pattern

Once you've picked a design pattern, how do we use it? Let's see a step-by-step:

1. Read the pattern once through for an overview, paying attention espeacilly to Applicability and Consequences.
2. Go back and study the Structure, Participants and Collaborations sections, make sure you understand it.
3. Look at some code sample to see a concrete example of the pattern in code.
4. Choose names for pattern participants that are meaningful in the application context. Usually, names for participants are too abstract to appear directly in an application. Nevertheless, it's useful to incorporate the participant name into the name that appears in the application.
5. Define the classes. Declare their interfaces, establish their inheritance relationships, and define instance variables that represent data and object references. Identify classes in you application that the pattern will affect, and modify them accordingly.
6. Define application-specific names for operations in the pattern. Here again, the names generally depend on the application. Use the responsibilities and collaborations associated with each operation as a guide.
7. Implement the operations to carry out the responsibilities and collaborations in the pattern.

Over time you'll learn to do this by your own and maybe put "your face" on it.

{% for author in site.data.author%}
In the next post, we're going to try to design a document editor. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>
{% endfor %}
