---
layout: posts
title: "Learning SQL"
summary: "SQL is a standard language for accessing databases, on this post you are going to understand more about the language and learn how to programe on it."
homeImage: "/assets/img/sql-icon.png"
type: post
permalink: learning-sql
---

<h2 class="post__text-title">{{ page.title }}</h2>

![SQL Logo]({{ page.homeImage }})

Hello, today you are going to learn how to programe on SQL. Like I said on the post's description, SQL helps you to access data from a database, with this information in mind, let's start.

To facilitate our learning, I will give you a table called "movies" , we will work around this table.

<img src="/assets/img/table.jpg" alt="table" width="700" height="300">

First of all, let's learn how to get a particular data that you want, a title, a id... Whatever, anything you want. For example, if I want all the movie titles:

`
SELECT title
FROM movies;
`

There is a keyword on SQL called **WHERE**, that put a condition to the query, see the example below:

`
SELECT title
FROM movies
WHERE duration < 100;
`

So, this query will return titles of the movies that have less than 100 minutes of duration, isn't this keyword very useful?

In SQL we have **AND** and **OR** statements, they work with the **WHERE**, they add one more condition to the **WHERE**, the difference between **AND** and **OR** is that with the **AND**, the two conditions need to be true, so, the query will just return the data that respect those two conditions, and with **OR** only one need to be true, so, the query will return the data that respect one condition or the other one. Look the example:

<code>	
SELECT title
FROM movies
WHERE duration < 100
AND genre = "Sci-fi";
<br>
SELECT title
FROM movies
WHERE duration < 100
OR genre = "Sci-fi";
</code>


If you look at the table, you will see that the first query will return nothing, and the second will return all the titles.

A cool thing to use too is the **ORDER BY** statement, it will return the rows ordered by the column that you passed to order by, and there is a variation putting the keyword **DESC** at the final of the statement, this will return the rows ordered in a decreasing way.

`
SELECT title
FROM movies
ORDER BY duration DESC;
`

This will return to us the movie titles ordered by the longest one to the shortest one.

Now, we've learned how to manipulate data already created, now, let's create some data with the **INSERT** statement:

`
INSERT INTO movies(id, title, genre, duration)
VALUES (5, 'Yes, sir', 'Comedy', 120 );
`

With this command, we added other film to the table, of course you can add just id and title or just genre and duration, but this will leave some itens with a null value, and this isn't good. But, if you do it, there is a way to correct it, just by the **UPDATE** query, that update a already created data.

`
UPDATE movies
SET title = 'National Security'
WHERE title = 'Nosferatu';
`
So I changed the movie title from "Nosferatu" to "National Security" with this command.

I can even delete data that a I don't want it to be there, using **DELETE**:

`
DELETE title
FROM movies
WHERE title = 'Yes, sir';
`

I've just deleted the row that I created with the **INSERT** query.

Now, let's learn how to manipulate tables. Before manipulating tables, we need to have one database, right? So creating database is easy, just by using **CREATE DATABASE** statement:

`
CREATE DATABASE name;
`

And, it's done, once you want to delete this database, simply do it with the **DROP DATABASE** statement:

`
DROP DATABASE name;
`

Once you created a database, now you can create tables, using **CREATE TABLE** and defining what columns do you want:

`
CREATE TABLE movies
(
	id int PRIMARY KEY,
	title varchar(20) UNIQUE,
	genre varchar(20) NOT NULL,
	duration int NOT NULL
);
`

So, I created the table that we are using to learn on this post, but I added 3 keywords that you didn't see before: **PRIMARY KEY, UNIQUE, NOT NULL**. So what these keywords do?

- **PRIMARY KEY** ---> the item cannot have the same value as other item and cannot be null.
- **UNIQUE** ---> the item cannot have the same value as other item in this column.
- **NOT NULL** ---> the item cannot be null.

If you don't want to use this table anymore:

`
DROP TABLE movies;
`

If you want to alter the table, adding or removing columns, you can use **ALTER TABLE** statement:

<code>
ALTER TABLE name
ADD COLUMN name datatype;
<br>
ALTER TABLE name
DROP COLUMN name;
</code>

In SQL, we have a few function that return us some different values:

- **count(columnName)**  --- returns the number of row that match
- **sum(columnName)** --- returns the added sum of values for a group of rows
- **avg(columnName)** --- returns calculated average value for a group
- **max(columnName)** --- returns the largest value
- **min(columnName)** --- returns the smallest value

There is another statement called **GROUP BY**, but, how does it work? GROUP BY works with similiar values on a column, for example, if I have two movies of the same genre, and I want the sum of their duration:

`
SELECT genre, sum(duration)
FROM movies
GROUP BY genre;
`

This query will return not only the duration of the two movies in a sum, but the duration of all other movies with different genre.

You can use the **HAVING** clauses to limit the return, if I do the previous query with the **HAVING**:

`
SELECT genre, sum(duration)
FROM movies
GROUP BY genre
HAVING count(*) > 1;
`

This will return only the genre with more than one movie. A **WHERE** clauses can suit on this query if you want to limit more the query return.

I've already shown you the **UNIQUE** cluases, but I didn't show you the table syntax of it.

`
CONSTRAINT message UNIQUE (columnName, columnName...);
`

This will bring the same effect of the other way, but here you can change de error message.

I will introduce you now a very useful tool in SQL called **FOREIGN KEY**, this clauses is used to create column, like **PRIMARY KEY**, but it will make reference to a column, but a column from another table.

`
	In creation of a column:
	columnName datatype REFERENCES tablename(columnName);
	OR (using table syntax):
	FOREIGN KEY (column) REFERENCES tablename;
`

If you don't pass the name of the column, it will refer to the PRIMARY KEY. 

There is a clause called **CHECK**, that you use it when you're creating a column, works like this:

`
	columnName datatype CHECK (condition)
`

It will put a condition to the values that this column will receive. If it is a integer, so you can put a condition that every value need to be higher than 0, it's a example.

Now I going to talk about something very important, about normalization, we have two primordial rules of normalization in SQL:

- First: A item can't have multiple information.
- Second: Avoid redundancy.

Commenting the rules, the first is simple, we can't have a item on genre column with two information, like: "Action, Adventure". It needed to be separated. To explain the second rule, let's use the separation of the genres, what would we do to separate? Create to rows with the same title and duration, but with different genres? No, this is against the second rule.

So, What would we do? Create what is called **JOIN TABLE**, creating a table called "movies" with id, title and duration, other table called "genre" with id and genre, and the JOIN TABLE, that we can call it "movie_genre", with id_movie and id_genre. Using foreign keys (movies table id with movie_id and genre table id with id_genre), we have the normalization of the situation.

There is a thing in SQL called the RELETIONSHIP between two columns, there are three types of relationship, I will talk about them below:

- **ONE TO ONE** : A column that just one item can be related to other item of other column, an example: One costumer can only have one address.
- **ONE TO MANY** : A column that just one item can be related to many other items of other column, example: One duration can have many movies, but a movie can have only one duration.
 - **MANY TO MANY**: A column that many items can be related to many other items of other column, example: one movies can have many genres, and one genre can have many movies.

So, everytime that you have a **MANY TO MANY** relationship, you will need to create a **JOIN TABLE** to follow the normalization rules.

Talking about joins, we have a two clauses, called **INNER JOIN** and **OUTER JOIN**, let's talk about **INNER JOIN** first.

INNER JOIN consist on taking two tables, and take all the intersection between this two tables, for example, you have two tables, one called "movies" and other called "rooms", the movies table have a column called "room_id", and this column is a FOREIGN KEY for the room's id column, and you want to retrieve all the movies that have a room already arranged, so you do:

`
SELECT *
FROM rooms
INNER JOIN movies
ON rooms.id = movies.room_id;
`

So, this will return all the movies that have rooms, and all the information about them.

Now, talking about the **OUTER JOIN**, we have two types of it, the left and the right **OUTER JOIN**. Let's return to the previous example, if we use tha query below: 

`
SELECT *
FROM rooms
RIGHT OUTER JOIN movies
ON rooms.id = movies.room_id;
`

This will return all the movies, and the rooms of the movies that already have a arranged room. If I do:

`
SELECT *
FROM rooms
RIGHT OUTER JOIN movies
ON rooms.id = movies.room_id;
`

This will return all the rooms, and the movies that will be played on the rooms.

There is a tool in SQL called **subqueries**, very useful, basically you use a query inside other. Let's thing about a example of when you will need this, you have two tables: "movies", "promotions". In promotions you have the "movie_id" column, and you want to select all the movies that have the promotion of "Pay one, get two", so:

`
SELECT title
FROM movies
WHERE id IN 
(SELECT movie_id
FROM promotions
WHERE category = 'Pay one, get two';)
`

So, the subquery will return the movie's  id that have the promotion you want.

And to finalize our post, let's talk about a thing that will facilitate our lifes, somthing called **ALIASES**, we can use in two ways:

`
SELECT *
FROM rooms r
RIGHT OUTER JOIN movies m
ON r.id = m.room_id;
`

To shorten the table's names, and:

`
SELECT title 'Action Movies'
FROM movies;
`

To change the column title on the return.

{% for author in site.data.author%}
So this is it, now you know how to manipulate a database. You can find me on <a href="{{ author.social.facebook }}" target="_blank">Facebook</a> and <a href="{{ author.social.twitter }}" target="_blank">Twitter</a>, if you have any dought with the tutorial, contact me.
{% endfor %} 