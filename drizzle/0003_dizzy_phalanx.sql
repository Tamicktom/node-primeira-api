-- Custom SQL migration file, put your code below! --

-- fill the users.password column with the value '123456'
UPDATE users SET password = '123456';