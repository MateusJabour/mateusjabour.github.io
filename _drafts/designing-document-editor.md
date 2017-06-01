---
layout: posts
title: "Designing a Document Editor"
summary: "Continuing to learn about design patterns, we're going to design a Document editor using some design patterns."
homeImage: "/assets/img/design-patterns-1.jpg"
type: post
permalink: designing-document-editor
---

<h2 class="post__text-title">{{ page.title }}</h2>

![Design patterns are cool]({{ page.homeImage }})

In this post, we're going to see a case study in the design of a "What-You-See-Is-What-You-Get" or WYSIWYG document editor called Lexi. We're going to see eight patterns just designing this editor.

### Design problems

We will examine seven problems in Lexi's design:

1. *Document structure:* The choice of internal representation for the document affects nearly every aspect of Lexi's design. How we organize this information will impact the design of the rest of the application.
2. *Formatting:* How does Lexi actually arrange text and graphics into lines and columns? How about different formatting?
3. *Embellishing the user interface:* Lexi's user interface includes scroll bars, borders and drop shadows that embellish the WYSIWYG, and. it's important to have the option to remove and add this embellishments easily.
4. *Supporting multiple look-and-feel standards:* Lexi should adapt easily to different look-and-feel standards without major modification.
5. *Supporting multiple window systems:* Different look-and-feel standards are usually implemented on different window systems. Lexi's should be as independent of the window system as possible.
6. *User operations:* Users control Lexi through various user interfaces, including buttons and pull-down menus. The challenge is to provide a uniform mechanism both for accessing all the functionality that are going to be scattered, and for undoing its effects.
7. *Spelling checking and hyphenation:* How does Lexi support analytical operations such as checking for misspelled and determining hyphenation points?

We're going to have a section for each problem, and we'll talk about them.

### Document structure

A document is ultimately just an arrangement of basic graphical elements such as characters, lines, polygons and other shapes. But, we also have to talk about them in terms of the document's physical structure: lines, columns, figures, tables and other substructures. Lexi's user interface should let users manipulate these substructures directly, allowing the user to treat a table or a diagram as a unit rather than as a collection of individual graphical primitives.

In particular, the internal representation should support the following:

- Maintaining the document's physical structure, that is, the arrangement of text and graphics into lines, columns, table, etc.
- Generating and presenting the document visually.
- Mapping positions on the display to elements in the internal representation, allowing user to refer to something just by point to in.

First, we should treat text and graphics in the same way, avoiding treating one being the special case of the other. Second, we shouldn't distinguish between single and groups of elements in the internal representation. We're going to contradict the second constraint when we need to analyze the text for such things as spelling errors and potential hyphenation points.

#### Recursive Composition

Recursive composition is a way to build complex elements out of simpler ones. It gives us a way to compose a document out of simple graphical elements. As a first step, we can tile a set of characters and graphics from left to right to form a line in the document. Then multiple lines can be arranged to form a column, multiple columns can form a page and so on.

![2.2]()
![2.3]()

Devoting to each important element an object can be the representation of the physical structure. By using an object to each character and graphical element in the document, we promote flexibility at the finest levels of Lexi's design. We can treat text and graphics in the same way, just differing in each of their ways of drawing, formatting and embedding within each other. This way, we can even extend new characters without disturbing other functionality.

Designing Lexi like this implies in two things: The objects need corresponding classes and these classes must have compatible interfaces, because we want to treat the objects uniformly. We're going to use inheritance so we can have compatible interfaces.

### Glyphs

We'll define a Glyph abstract class for all objects that can appear in a document structure. Subclasses of this class will be both graphical and structural elements. Look how we're going to design the hierarchy:

![2.4]()

Glyphs have 3 responsibilities: They know how to draw themselves, what space they occupy and their children and parent. Each subclass will redefine Draw to render themselves onto a window. Window is a class that defines graphics operations for rendering text and basic shapes in a window on the screen. A reference of window inside each subclass will be used, like a Rectangle subclass of Glyph:

```
void Rectangle::Draw(Window* w) {
  w->DrawRect(_x0, _y0, _x1, _y1);
}
```

DrawRect is a operation from Window.

A parent glyph often needs to know how much space a child glyph occupies, for example, to arrange it and other glyphs in a line so that none overlaps. The Bounds operation returns the rectangular area that the glyph occupies. The subclasses of Glyph redefine this operation to return the rectangular area in which they draw.

The Intersects operation returns whether a specified point intersects the glyph. Whenever the user clicks somewhere in the document, Lexi uses this operation to know which glyph or structure is under the mouse. Insert is an operation that inserts a glyph at a position specified by an integer index. And Remove is an operation to remove a specified glyph if it is a child. Child operation return the child at the given index. And Parent provides a standard interface to the glyph's parent, if any.

#### Composite Pattern

Recursive composition is good for more than just documents. We can use it to represent any potentially complex, hierarchical structure. The Composite pattern captures the essence of recursive composition in object-oriented terms.

### Formatting

We need to know how we're going to construct a particular physical structure, on that corresponds to a properly formatted document. Representation and formatting are distinct: The ability to capture the document's physical structure doesn't tell us how to arrive at a particular structure. This responsibility rests on Lexi. It must break text into lines, lines into columns, and so on. We'll restrict "formatting" to mean breaking a collection of glyphs into lines.

#### Encapsulating the Formatting Algorithm

It's not easy to automate the formatting with all its constraints and details. We can do it in many ways, and other people have come up with variety of formatting algorithms with different strengths and weaknesses. Because Lexi is a WYSIWYG, we should think about the trade-off of balancing formatting quality and speed. Normally, we want good response without sacrificing how good the document looks. This trade-off is subject to many factors, but we can't check them in compile-time. Other situation is to make the response slower, but having a good formatting. This trade-off is completely different from the last one. Another, more implementation-driven trade-off is to balance formatting speed and storage requirements, maybe by caching more information.

Formatting algorithms tend to be complex, and it's important to keep them well contained or completely independent of the document structure. Adding a new formatting algorithm shouldn't require modifying existing glyphs, to achieve this, we can create a subclass of Glyph without regarding the formatting algorithm.

We're going to design Lexi making the format changing easier at least at compile-time, and maybe on run-time. Isolating the algorithm and making it easily replaceable at the same time by encapsulating it in a object is how we're going to implement it. Also, we're going to define an interface that supports a wide range of formatting algorithms, and each subclass will implement the interface to carry out a particular algorithm.

#### Compositor and Composition

We'll define a Compositor class for objects that can encapsulate a formatting algorithm. The compositor will know what glyph to format and when to do it. The glyphs it formats are the children of a special Glyph subclass called Composition. A composition gets an instance of a Compositor subclass when it is created, and it tells the compositor to Compose its glyphs when necessary.

Each Compositor subclass can implement a different linebreaking algorithm. This is possible thanks to the Compositor-Composition split, it ensures strong separation between code that supports the document's physical structure and the code for different formatting algorithms. We can add new Compositor subclass without touching the glyph classes, and vice versa. We could add a SetCompositor operation to change the linebreaking on run-time.

#### Strategy Pattern

Encapsulating an algorithm in an object is the intent of Strategy pattern. Compositors are strategies, they encapsulate different formatting algorithms, and composition is the context for a compositor Strategy. The key to applying the Strategy pattern is designing interfaces for the strategy and its context that are general enough to support a range of algorithms. You shouldn't have to change the strategy or context interface to support a new algorithm.

### Embellishing the User Interface

We're going to implement two different embellishments. First, we'll add a border around the text editing area. The second, it will be the scroll bars. We're not going to use inheritance to add them to the interface. To have more flexibility, we're going to design those embellishments in a way that the user interface objects will not know about the embellishments, and we'll be able to use those embellishments without changing anything.

#### Transparent Enclosure

Object composition offers a potentially more workable and flexible extension mechanism. Since we know we're embellishing an existing glyph, we could make the embellishment itself an object. We could have the border contain the glyph, which makes sense given that the border will surround the glyph on the screen. The fact that borders have an appearance suggests they should actually be glyphs, so, Border should be a subclass of Glyph.

When clients tell a plain, unbordered glyph to draw itself, it should do so without embellishment. If that glyph is composed in a border, clients shouldn't have to treat the border containing the glyph any differently. This way, the Border interface matches the Glyph interface, we subclass Border from Glyph to guarantee this relationship.

All this leads us to Transparent Enclosure, which combines the notions of single-child composition and compatible interfaces. Clients normally can't tell whether they're dealing with the component or its enclosure, especially if the enclosure simply delegates all its operations to its component.

#### Monoglyph

We can use the concept of transparent enclosure to all glyphs that embellish other glyphs. We'll create a subclass of Glyph called MonoGlyph to be an abstract class for all embellishments, like Border and Scroller. Basically, MonoGlyph stores a reference to a component and forwards all requests to it.

![2.7]('')

That makes MonoGlyph totally transparent to clients by default. For example, MonoGlyph implements the Draw operation like this:

```
void MonoGlyph::Draw (Window* w) {
  _component->Draw(w);
}
```

MonoGlyph subclasses reimplement at least one of these forwarding operations. Border::Draw, for instance, first invokes the parent class operation MonoGlyph::Draw on the component to let the component do its part, that is to draw everything but the border. Then Border::Draw draws the border by calling a private operation called DrawBorder, the details of which we'll omit:

```
void Border::Draw (Window* w) {
  MonoGlyph::Draw(w);
  DrawBorder(w);
}
```

Another MonoGlyph subclass appears in the figure of the MonoGlyph organization, it is the Scroller. It's a MonoGlyph that draws its component in different locations based on the positions of two scroll bars, which it adds as embellishments. Now we have all the pieces we need to add a border and the scroll bar. We compose the existing Composition instance in a Scroller instance to add the scrolling interface, and we compose that in a Border instance. The resulting object structure it's below:

![2.8]('')

#### Decorator Pattern

The Decorator pattern captures class and object relationship that support embellishment by transparent enclosure. The term "embellishment" actually has broader meaning than what we've considered here. In the Decorator pattern, embellishment refers to anything that adds responsibilities to an object. Decorator generalizes the approach we've used in Lexi to make it more widely applicable.

### Supporting Multiple Look-and-Feel Standards

Achieving portability across hardware and platforms is a major problem in system design. Retargeting Lexi to a new platform shouldn't be a problem, or it wouldn't be worth to do it. We should make porting as easy as possible. One obstacle to portability is the diversity of look-and-feel standards, which are made to enforce uniformly between applications. But what are those standards? They basically define guidelines for how applications appear and react to the user.

Our design goals are to make Lexi conform to multiple existing look-and-feel standards and to make it easy to add support for new standards as they (invariably) emerge. We also want our design to support the ultimate in flexibility, making Lexi being able to change its look and feel at run-time.

#### Abstracting Object Creation

Everything we see and interact with in Lexi's user interface is a glyph composed in other, invisible glyphs like Row and Column. The invisible glyphs compose visible ones like Button and Character and lay them out properly. We can call the visible ones as "widgets". Widgets might use simpler glyphs such as characters, circles, rectangles and polygons to present data.

We'll assume we have two set of widgets glyph classes with which to implement multiple look-and-feel standards:

1. A set of abstract Glyph subclasses for each category of widget glyph.
2. A set of concrete subclasses for each abstract subclass that implement different look-and-feel standards.

Lexi must distinguish between widgets for each look-and-feel. It needs a way to determine the look-and-feel standard that's being targeted in order to create the appropriate widgets. Not only must we avoid making explicit constructor calls, but, we also must be able to replace a widget set easily. We can do it by abstracting the process of object creation. Let's see an example.

#### Factories and Product Classes

Normally we might create and instance of a Motif scroll bar glyph with the following C++ code:

```
ScrollBar* sb = new MotifScrollBar;
```

This is the kind of code to avoid if you want to minimize Lexi's look-and-feel dependencies. But suppose we initialize sb as follows:

```
ScrollBar* sb = guiFactory->CreateScrollBar();
```

guiFactory is an instance of a MotifFactory class. CreateScrollBar returns a new instance of the proper ScrollBar subclass for the look and feel desired. The guiFactory object abstracts the process of creating not just Motif scroll bars but scroll bars for any look-and-feel standard. And guiFactory ins't limited to producing scroll bars.

All this is possible because MotifFactory is a subclass of GUIFactory, an abstract class that defines a general interface for creating widget glyphs. It includes operations like CreateScrollBar and CreateButton for instantiating different kinds of widgets.

We say that factories create product objects. Moreover, the products that a factory produces are related to one another. In this case, the products are all widgets for the same look and feel.

But, you're asking yourself, where does the GUIFactory instance come from? Anywhere convenient. The variable guiFactory could be a global, a static member of a well-known class, or even a design pattern, Singleton, for managing well-known, one-of-a-kind objects like this. The important, thought is to initialize guiFactory at a point in the program before it's ever used to create widgets but after it's clear which look and feel is desired.

If the look and feel is known at compile-time, then guiFactory can be initialized with a simple arrangement assignment of a new factory instance at the beginning of the program:

```
GUIFactory* guiFactory = new MotifFactory;
```

If the user can specify the look and feel with a string name at startup time, then the code to create the factory might be:

```
GUIFactory* guiFactory;
const char* styleName = getenv("LOOK_AND_FEEL");

if (strcmp(styleName, "Motif") == 0) {
  guiFactory = new MotifFactory;
} else if (strcmp(styleName, "Presentation_Manager") == 0) {
  guiFactory = new PMFactory;
} else {
  guiFactory = new DefaultGUIFactory;
}
```

There are better ways to select factory at run-time.


#### Abstract Factory Pattern

Factories and products are the key participants in the Abstract Factory pattern. This pattern captures how to create families of related product objects without instantiating classes directly. We choose between families by instantiating a particular concrete factory and using it consistently to create products thereafter. We can also swap entire families of products by replacing the concrete factory with an instance of a different one. The Abstract Factory pattern's emphasis on families of products distinguishes it from other creational patterns, which involves only one kind of product object.

### Supporting Multiple Window Systems

Another issue we can have is the windowing environment in which Lexi will run. Several important and largely incompatible window systems exist today. We'd like Lexi to run on as many of them as possible.

#### Can We Use an Abstract Factory?

At first glance this may look like another opportunity to apply the Abstract Factory pattern. But the constraints for window system portability differ significantly from those for look-and-feel independence.

In applying the Abstract Factory pattern, we assumed we would define the concrete widget glyph classes for each look-and-feel standard. That meant we could derive each concrete product for a particular standard from an abstract product class. But suppose we already have several class hierarchies from different vendors, one of each look-and-feel standard. Of course, it's highly unlikely these hierarchies are compatible in any way. Hence, we won't have a common abstract product class for each kind of widget, and the Abstract Factory pattern won't work without those crucial classes. We have to make the different widget hierarchies adhere to a common set of abstract product interfaces.

We're faced with a similar problem when we try to make Lexi work on existing window systems; namely, different window systems have incompatible programming interfaces. It's a little bit harder. Like look-and-feel standards, we don't have a radical difference between window systems, because they have generally the same function. We need a uniform set of windowing abstractions that lets us take different window system implementations and slide any one of them under a common interface.

#### Encapsulating implementation Dependencies

We have previously seen a introduction of the Window class for displaying glyph or glyph structure on the display. We didn't specify the window system that this object worked with, because the truth is that it doesn't come from any particular window system. It encapsulates the things windows tend to do across window systems:

- They provide operations for drawing basic geometric shapes.
- They can inconify and de-iconify themselves.
- They can resize themselves.
- They can (re)draw their contents on demand, for example, when they are deiconified or when an overlapped and obscured portion of their screen space exposed.

The Window class should handle different windows systems, and we have two extreme approaches to solve this:

1. Intersection of functionality: The Window class interface provides only functionality that's common to all window.
2. Union of functionality: Create an interface that incorporates the capabilities of all existing systems.

Both of them aren't viable solutions, so, we're going to use something between does two. The Window class will provide a convenient interface that supports the most popular windowing features. That means Window's interface must include a basic set of graphics operations that lets glyphs draw themselves in the window. Look at some operations:

![2.3]('')

Window is an abstract class, and each subclass of it will support the different kind of windows.

![tabela window]('')

Now that we've defined a window interface for Lexi to work with, where does the real platform-specific window come in?

One approach is to implement multiple versions of the Window class and its subclasses, one version for each windowing platform, choosing which version to use. This approach would demand too much maintenance. Alternatively, we could create implementation-specific subclasses of each class in the Window hierarchy, but this would cause another subclass explosion. Both of the approaches also don't give us flexibility to change the window system we use after we've compiled the program.

The best solution is to do the same thing we did to embellishments: Encapsulate the concept that varies. What varies is the window system implementation. With the functionality encapsulated, we can implement our Window class and subclasses in terms of that object's interface.

#### Window and WindowImp

We'll define a separate WindowImp class hierarchy in which to hide different window system implementations. WindowImp is an abstract class for objects that encapsulate window system-dependent code. Each WindowImp subclass is a different system. Check the diagram:

![windowimp diagrama]('')

By hiding the implementation in WindowImp classes, we avoid polluting the Window class with window system dependencies, which keeps the Window class hierarchy comparatively small and stable.

#### WindowImp Subclasses

Subclasses of WindowImp convert requests into window system-specific operations. We defined the Rectangle::Draw in terms of the DrawRect operation on the Window instance:

```
void Rectangle::Draw (Window* w) {
  w->DrawRect(_x0, _y0, _x1, _y1);
}
```

The default implementation of DrawRect uses the abstract operation for drawing rectangles declared by WindowImp:

```
void Window::DrawRect (Coord x0, Coord y0, Coord x1, Coord y1) {
  _imp->DeviceRect(x0, y0, x1, y1);
}
```
\_imp is a member variable of Window that stores the WindowImp with which the Window is configured. The window implementation is defined by the instance of the WindowImp subclass that \_imp points to.

#### Configuring Windows with WindowImp

A key issue we haven't address is how a window gets configured with the proper WindowImp subclass in the first place. We need to think about two things: When the \_imp is initialized and who knows what window system is in use.

We'll focus on the solution that uses the Abstract Factory pattern. We can define an abstract factory class WindowSystemFactory that provides an interface for creating different kinds of window system-dependent implementation objects:

```
class WindowSystemFactory {
  public:
    virtual WindowImp* CreateWindowImp() = 0;
    virtual ColorImp* CreateColorImp() = 0;
    virtual FontImp* CreateFontImp() = 0;

    // a "Create..." operation for all window system resources
};
```

Now we can define a concrete factory for each window system:

```
class PMWindowSystemFactory : public WindowSystemFactory {
  virtual WindowImp* CreateWindowImp() {
    return new PMWindowImp;
  }
};

class XWindowSystemFactory : public WindowSystemFactory {
  virtual WindowImp* CreateWindowImp() {
    return new XWindowImp;
  }
};
```

The Window base class constructor can use the WindowSystemFactory interface to initialize the \_imp member with the WindowImp that's right for the window system:

```
Window::Window() {
  _imp = windowSystemFactory->CreateWindowImp();
}
```

The windowSystemFactory variable is a well-known instance of a WindowSystemFactory subclass, akin to the well-known guiFactory variable defining the look and feel. The windowSystemFactory variable can be initialized in the same way.

#### Bridge Pattern

The relationship between Window and WindowImp is an example of the Bridge pattern. The intent behind Bridge is to allow separate class hierarchies to work together even as they evolve independently. Our design criteria led us to create two separate class hierarchies, one that supports the logical notion of windows, and another for capturing different implementations of windows. The Bridge pattern lets us maintain and enhance our logical windowing abstraction without touching window system-dependent code, and vice-versa.

### User Operations

Some of Lexi's functionality are: Enter and delete text, move the insertion point, select ranges of text by pointing, clicking, and typing directly in the document. Other functionality is accessed indirectly through user operations in Lexi's pull-down menus, buttons and keyboard accelerators. Those functionalities could be:

- Creating a new document.
- Opening, saving, printing.
- Cutting selected text out.
- Changing font and style of selected text.
- Changing the formatting of the text(alignment and justification).
- Quitting the application.
- Etc.

We don't want to associate a particular user operation with a particular user interface, because we may want multiple user interfaces to the same operation. Furthermore, these operations are implemented in many different classes, and as implementors, we want to access their functionality without creating lots of dependencies between implementation and user interface classes.

We want Lexi to support undo and redo, but, just for document-modifying operations like delete, and we shouldn't try to undo operations like saving and quitting application.

#### Encapsulating a Request

The difference between pull-down menus and other glyphs that have children is that most glyphs in menus do some work in response to an up-click. Let's assume that these work-performing glyphs are instance of a Glyph subclass called MenuItem and that they do their work in response to a request from a client. We could define a subclass of MenuItem for every user operation and then hard-code each subclass to carry out the request. But that's not really good.

We need a mechanism to parameterize menu items by the request they should fulfill. That way we avoid proliferation of subclasses and allow for greater flexibility at run-time. We should parameterize MenuItem with a object, not a function, then, we can use inheritance to extend and reuse the request's implementation. We also have a place to store state and implement undo/redo functionality. We'll encapsulate each request in a **command** object.

#### Command Class and Subclasses

First we define a Command abstract class to provide an interface for issuing a request. The basic interface consists of a single abstract operation called "Execute". Subclasses of Command implement Execute in different ways to fulfill different requests. MenuItem can store a Command object that encapsulates a request. We give each menu item object an instance of the Command subclass that's suitable for that menu item, just as we specify the text to appear in the menu item. The MenuItem simply calls Execute on its Command object to carry out the request. Note that buttons and other widgets can use commands in the same way menu items do.

#### Undoability

Undo/redo is an fundamental feature for editors like Lexi. To undo and redo commands, we need to add an Unexecute operation to Command's interface. Unexecute does the inverse of the preceding Execute operation. Sometimes undoability must be determined at run-time. A request to change the font of a selection does nothing if the text already appears in that font. If the user repeats the spurious font change several times, he shouldn't gave to perform the same amount of undo operations to get back. So, to determine if a command is undoable, we add an abstract Reversible operation that returns boolean.

#### Command History

The final step in supporting arbitrary-level undo and redo is to define a command history or list of commands that have been executed. The history looks like this:

![''](command history)

Each circle represents a Command object. The line marked "present" keeps track of the most recently executed (and unexecuted) command. To undo the last command, we simply call Unexecute on the most recent command.

![''](command history)

After unexecuting the command, we move the present line on command to the left.

![''](command history)

You can see that by simply repeating this, we get multiple levels of undo. To redo the command that's just been undone, we do the same thing in reverse, just call Execute on the last unexecuted object.

![''](command history)

Then we advance the present line so that a subsequent redo will call redo on the following command in the future:

![''](command history)


### Command Pattern

Lexi's commands are an application of the Command pattern, which describes how to encapsulate a request. The command pattern prescribes a uniform interface for issuing requests that lets you configure clients to handle different requests. The interface shields clients from the request's implementation. A command may delegate all, part, or non of the request's implementation to other objects. This is perfect for applications like Lexi that must provide centralized access to functionality scattered throughout the application. The pattern also discusses undo and redo mechanisms built on the basic Command interface.

### Spelling Checking and Hyphenation

The last design problems is checking for misspellings and introducing hyphenation points. There's more than one way to check spelling and compute hyphenation points, each one with its trade-offs. So here we want to support multiple algorithms. also avoid writing this functionality into the document structure. Inevitably we'll want to expand Lexi's analytical abilities over time, but, we don't want to change the Glyph class and all its subclasses every time we introduce new functionality of this sort.

There are actually two pieces of the puzzle:
 - Accessing the information to be analyzed, which we have scattered over the glyphs in the document structure.
 - Doing the analysis.


#### Accessing Scattered Information

Many kinds of analysis require examining the text character by character. The text we need to analyze is scattered throughout a hierarchical structure of glyph objects. We need an access mechanism that has knowledge about the data structures in which objects are stored. Some glyphs might store their children in linked lists, others might use arrays, and still others might use more esoteric data structures. Our access mechanism must be able to handle all of these possibilities.

An added complication is that different analyses access information in different ways, most are from beginning to end, but, some do the opposite. So our access mechanism must accommodate differing data structures, and we must support different kinds of traversals, such as preorder, postorder and inorder.

#### Encapsulating Access and Traversal

Right now our glyph interface uses an integer index to let clients refer to children. Although that might be reasonable for glyph classes that store their children in an array, it may be inefficient for glyphs that use a linked list.

Therefore only the glyph can know the data structure it uses. The glyph interface shouldn't be biases toward on data structure. We can solve this problem and support several different kinds of traversals at the same time. We can put multiple access and traversal capabilities directly in the glyph classes and provide a way to choose among them.

We might add the following abstract operations to Glyph's interface to support this approach:

  - void First(Traversal kind) - initializes the traversal, parameter with the Traversal type, it's a enumatared constant with values such as CHILDREN, PREORDER, POSTORDER and INORDER.
  - void Next - advances to the next glyph in the traversal.
  - bool IsDone - returns if the traversal is over.
  - Glyph* GetCurrent() - replaces the Child operation, access the current glyph.
  - Void Insert(Glyph*) - inserts the given glyph at the current position.

An analysis would use the following C++ code to do a preorder traversal of a glyph structure rooted at g:

```
Glyph* g;

for (g->First(PREORDER); !g->IsDone(); g->Next()) {
  Glyph* current = g->GetCurrent();

  //do some analysis
}
```

There's no longer anything that biases the interface toward one kind of collection of another. But this approach still has problems. For one thing, it can't support new traversals without either extending the set of enumerated values or adding new operations.

We'd live to avoid changing existing declarations. Putting the traversal mechanism entirely in the Glyph class hierarchy makes it hard to modify or extend without changing lots of classes.

Once again, a better solution is to encapsulate the concept that varies, in this case, the access and traversal mechanisms. We can introduce a class of objects classes iterators whose sole purpose is to define different sets of these mechanisms. We can use inheritance to let us access different data structure uniformly and support new kinds of traversals. We won't change the glyph interface.

#### Iterator Class and Subclasses

We'll user an abstract class called Iterator to define a general interface for access the traversal. Concrete subclasses like ArrayIterator and ListIterator implement the interface to provide access to arrays and lists, while PreorderIterator, PostorderIterator, and the like implement different traversals on specific structures. We're going to add a CreateIterator abstract operation to the Glyph class interface to support iterator.

The Iterator interface provides operations First, Next, and is Done for controlling the traversal, we can access the children of a glyph structure without knowing its representation:

```
Glyph* p;
Iterator<Glyph*>* i = g->CreateIterator();

for (i->First(); !i->isDone(); i->Next()) {
  Glyph* child = i->CurrentItem();

  //do something with current child
}
```

!['']('2.3')

CreateIterator returns a NullIterator instance by default. NullIterator's isDone operation always returns true. A glyph subclass that has children will override CreateIterator to return an instance of a different Iterator subclass. Which subclass depends on the structure that stores the children. If the Row subclass of Glyph stores its children in a list \_children, then its CreateIterator operation would look like this:

```
Iterator <Glyph*>* Row:CreateIterator () {
  return new ListIterator<Glyph*>(\_children);
}
```

Iterators for preorder and inorder traversals implement their traversals in terms of glyph-specific iterators. The iterators for these traversals are supplied the root glyph in the structure they traverse. They call CreateIterator on the glyphs in the structure and use a stack to keep track of the resulting iterators.

```
void PreorderIterator::First () {
  Iterator<Glyph*>* i = _root->CreateIterator();

  if (i) {
    i->First();
    _iterators.RemoveAll();
    _iterators.Push(i);
  }
}
```

CurrentItem would simply call CurrentItem on the iterator at the top of the stack:

```
Glyph* PreorderIterator::CurrentItem () const {
  Glyph* g = 0;
  if (_iterators.Size() > 0) {
    g = _iterators.Top()->CurrentItem();
  }
  return g;
}
```

The Next operation gets the top iterator on the stack and asks its current item to create an iterator. Next sets the new iterator to the first item in the traversal and pushes it on the stack. Then Next tests the latest iterator; if its IsDone operation returns true, then we've finished traversing the current subtree(or leaf) in the traversal. In that case, Next pops the top iterator off the stack and repeats this process until it finds the next incomplete traversal, if there is one; if not, then we have finished traversing the structure.

```
void PreorderIterator::Next () {
  Iterator<Glyph*>* i = _iterators.Top()->CurrentItem()->CreateIterator();
  i->First();

  while (_iterators.Size() > 0 ** _iterators.Top()->IsDone()) {
    delete _iterators.Pop();
    _iterators.Top()->Next();
  }
}
```

Notice how the Iterator class hierarchy lets us add new kinds of traversal without modifying glyph classes, only by subclassing Iterator and adding a new traversal. Because iterators store their own copy of the state of a traversal, we can carry on multiple traversals simultaneously, even on the same structure.


{% for author in site.data.author%}
In the next post, we're going to try to design a document editor. If you have any doubts about this post, talk with me on <a href="{{ author.social.facebook }}" target="\_blank">Facebook</a> or <a href="{{ author.social.twitter }}" target="\_blank">Twitter</a>
{% endfor %}
