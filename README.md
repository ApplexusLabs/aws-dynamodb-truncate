# aws-dynamodb-truncate
## Unfinished!

Simple script to truncate records in a DynamoDB database.  

Well, it doesn't really TRUNCATE in the SQL sense.  Rather its more like DELETE * from TABLE.  If you have a huge number of records to delete, you might be better off deleting and recreating the table. 

I got tired of doing test loads from Lambda routines and having to check each record via the console to delete.  Hoping that feature shows up soon in the console, but until then, here's what I'm using.

# Usage
~~~
node index.js <tablename>
~~~
