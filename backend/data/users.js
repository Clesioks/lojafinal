import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: "kornalewski@outlook.com",
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: "john@lotus.com",
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    },
    {
        name: 'Jane Doe',
        email: "jane@lotus.com",
        password: bcrypt.hashSync('123456', 10),
        isAdmin: false,
    }            

]


export default users